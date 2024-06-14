import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { handleSaveError, preUpdate } from './hooks';

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const themeList = ['light', 'violet', 'dark'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatarURL: String,
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      enum: themeList,
      default: 'violet',
    },
    avatar: String,
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userScheme.methods.hashPasswords = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};

userScheme.post('save', handleSaveError);
userScheme.pre('findOneAndUpdate', preUpdate);
userScheme.post('findOneAndUpdate', handleSaveError);

export const userSignupScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailPattern),
  password: Joi.string().min(6),
});

export const userSigninScheme = Joi.object({
  email: Joi.string().pattern(emailPattern),
  password: Joi.string().min(6),
});

export const userEditScheme = Joi.object({
  name: Joi.string().allow('').optional(),
  email: Joi.string().pattern(emailPattern).allow('').optional(),
  password: Joi.string().min(6).allow('').optional(),
});

export const userChangeThemeSchema = Joi.object({
  theme: Joi.string().valid(...themeList),
});

export const userHelpMailScheme = Joi.object({
  email: Joi.string(),
  comment: Joi.string(),
});

export const User = model('user', userSchema);
export default User;
