import { Schema, model } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

// ** Schema Interface
export interface IUser {
    username: string;
    email: string;
    password: string;
    cpassword: string;
}

// User schema
const userSchema = new Schema <IUser>(
    {
        username: {
            type: 'String',
            required: [true, 'Username is required'],
            unique: true,
        },
        email: {
            type: 'String',
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please enter a valid email']
        },
        password: {
            type: 'String',
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at lease 8 charachters'],
            validate: {
                validator: function (value: string) {
                    let strongPattern: RegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]).+$/
                    return strongPattern.test(value);
                },
                message: 'Password must contain at least one uppercase letter and one special character',
            },
        },
        cpassword: {
            type: 'String',
            validate: {
                validator: function (this: IUser, value: string) {
                    return value === this.password;
                },
                message: 'Passwords do not match'
            }
        }
    }, 
    {
        timestamps: true
    }
)

// Middleware to hash password & remove cpassword before saving
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Clear cpassword field after hashing
    this.cpassword = undefined;
    
    next();
  } catch (err: any) {
    next(err);
  }
});
 
// ** Create model
const User = model('user', userSchema)

export default User