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
    secure: environment == 'production' ? true : false,
    httpOnly: true
  }

  // Return response 
    return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      status: "Success",
      message: "Successfully login",
      accessToken
  });
}