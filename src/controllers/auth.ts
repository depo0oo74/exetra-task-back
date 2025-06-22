import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import handlingErrors from '../utils/handlingErrors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Vars
const secretKey: string | any = process.env.JWT_SECRET;
const tokenExpiration: string | any = process.env.JWT_EXPIRATION;
const cookieExpiration: number | any = process.env.JWT_COOKIE_EXPIRATION
const environment: string | any = process.env.NODE_ENV

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
    handlingErrors(error, req, res)
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
    return res.status(401).json({
      status: "Error",
      message:  "This email does not exist in our data"
    })
  }

  // check if password is correct
  const userEncryptedPass: string = isUser.password;
  const isPasswordCorrect: boolean = await bcrypt.compare(password, userEncryptedPass);
  if (!isPasswordCorrect) {
    return res.status(401).json({
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
    secure: true,
    httpOnly: true,
    sameSite: 'None',
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
      secure: true,
      httpOnly: true
    });
    
    res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error during logout",
    });
  }
};