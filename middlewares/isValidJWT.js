import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { isValidObjectId } from 'mongoose';

const { SECRET_KEY_ACCESS, SECRET_KEY_REFRESH } = process.env;

export const createJWT = (payload) => {
  return jwt.sign(payload, SECRET_KEY_ACCESS, { expiresIn: '12h' });
};

export const createRefresh = (payload) => {
  return jwt.sign(payload, SECRET_KEY_REFRESH, { expiresIn: '15d' });
};

export const isValidJWT = (token) => {
  return jwt.verify(token, SECRET_KEY_ACCESS);
};

export const isValidRefresh = (token) => {
  return jwt.verify(token, SECRET_KEY_REFRESH);
};

// new
const isValidateId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(400, `${id} is not valid Id`));
  }
  next();
};

export default isValidateId;
