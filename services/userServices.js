import { User } from '../model/user.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

export const findUserByToken = async (token) => {
  const user = await User.findOne({ accessToken: token });
  return user;
};

export const updateUserData = async (id, userData) => {
  const { password } = userData;

  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { ...userData },
    { new: true }
  );
  return updatedUser;
};

export const sendMail = (sender, comment) => {
  const config = {
    host: 'smtp.gmail.com',
    port: 465,
  };

  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: sender,
    to: process.env.SERVICE_EMAIL,
    subject: 'Please Help me',
    text: comment,
  };

  transporter.sendMail(emailOptions);
};
