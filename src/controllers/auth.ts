import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import handlingErrors from '../utils/handlingErrors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import sendEmail from '../utils/sendEmail'

// Vars
const secretKey: string | any = process.env.JWT_SECRET;
const tokenExpiration: string | any = process.env.JWT_EXPIRATION;
const cookieExpiration: number | any = process.env.JWT_COOKIE_EXPIRATION;
const environment: string | any = process.env.NODE_ENV;
const clientURL: string | any = process.env.CLIENT_URL;

// ** Signup controller 
export const signup = async (req: Request, res: Response) => {
  try {
    const payload: IUser = req?.body;

    // Create new user
    const newUser: IUser = (await User.create(payload));

    // delete password from retuned json
    newUser.password = undefined;

    // Return response 
    return res.status(201).json({
        status: "Success",
        message: "User has been created successfully",
        data: newUser
    });
  } catch (error) {
    handlingErrors(error, res)
  }
}


// ** Login cntroller 
export const login = async (req: Request, res: Response) => {
  const {email, password}: IUser = req.body

  // check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: "Error",
      message:  "Please provide email and password"
    })
  }

  // check if user exists
  const isUser: IUser | null = await User.findOne({email});
  if (!isUser) {
    return res.status(404).json({
      status: "Error",
      message:  "This email does not exist in our data"
    })
  }

  // check if password is correct
  const userEncryptedPass: string = isUser.password;
  const isPasswordCorrect: boolean = await bcrypt.compare(password, userEncryptedPass);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "Error",
      message:  "Password is not correct"
    })
  }

  // generate access token
  const payload: object = {id: isUser["_id"]};
  const accessToken: string = jwt.sign(payload, secretKey, {
    expiresIn: tokenExpiration
  })

  // cookie options
  const cookieExpiresIn: Date = new Date(Date.now() + cookieExpiration * 60 * 60 * 1000)
  const cookieOptions: object = {
    expires: cookieExpiresIn,
    secure: environment == 'production' ? true : false,
    httpOnly: true,
    sameSite: environment == 'production' ? 'None' : '',
  }

  // delete password from retuned json
    isUser.password = undefined;

  // Return response 
    return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      status: "Success",
      message: "Successfully login",
      data: isUser
  });
}

// ** check auth controller 
export const checkAuth = async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies?.accessToken;

  if (!token) return res.status(401).json({ 
    status: "Error",
    message:  "Not authorized",
    authenticated: false 
  });

  try {
    const decoded: object | any = jwt.verify(token, secretKey);
    res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ 
      status: "Error",
      message:  "Not authorized",
      authenticated: false 
    });
  }
}


// ** logout controller 
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', {
      secure: environment == 'production' ? true : false,
      httpOnly: true
    });
    
    res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (error) {
    handlingErrors(error, res)
  }
};

// ** Forgot password controller
export const forgotPassword = async (req: Request, res: Response) => {
  const { email }: IUser = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ 
      status: "Error",
      message: 'User not found' 
    });

    // generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token & expiration date in database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // send email to user with reset url
    const resetURL = `${clientURL}/reset-password/${resetToken}`;
    const message = `Click the link to reset your password: ${resetURL}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: message,
    });

    // return response
    res.status(200).json({ 
      status: "Success",
      message: 'Password reset email sent' 
    });

  } catch (error) {
    handlingErrors(error, res)
  }
};


// ** Forgot password controller
export const resetPassword = async (req: Request, res: Response) => {
  const { token } : string | any = req.params;
  const { password, cpassword } : IUser = req.body;

  // check payload
  if (!token || !password || !cpassword) {
    return res.status(400).json({ status: "Error", message: "Token and passwords are required" });
  }

  // check if passwords are match
  if (password !== cpassword) {
    return res.status(400).json({ status: "Error", message: "Passwords not match" });
  }

  try {
    // check token if valid
    const hashedToken: string = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: "Error", message: "Invalid or expired token" });
    }

    // clear reset token props and save
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // return response
    return res.status(200).json({ 
      status: "Success",
      message: "Password reset successfully"
    });

  } catch (error) {
    handlingErrors(error, res)
  }
};