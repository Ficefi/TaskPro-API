import HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import {
  createUser,
  findUserByEmail,
  validatePassword,
  updateUserWithToken,
  updateUserTokens,
} from '../services/authServices.js';

export const SignUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user) {
      throw HttpError(409, 'User already exist');
    }

    const avatarURL = gravatar.url(email, null, false);

    await createUser({ email, password, avatarURL });

    res.status(201).json({
      user: {
        email,
      },
      message: 'User created',
    });
  } catch (error) {
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw HttpError(401, 'Email is wrong');
    }
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      throw HttpError(401, 'Password is wrong');
    }

    const newUser = await updateUserWithToken(user.id);

    res.status(200).json({
      token: newUser.accessToken,
      refreshToken: newUser.refreshToken,
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const token = req.user.refreshToken;
  try {
    const { accessToken, refreshToken } = await updateUserTokens(token);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const LogOut = async (req, res, next) => {
  const { id } = req.user;
  try {
    await updateUserWithToken(id);

    res.status(204).json({
      message: 'No content',
    });
  } catch (error) {
    next(error);
  }
};
