import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { createUserSchema, loginUserSchema } from '../schemas/userSchemas.js';
import {
  SignIn,
  SignUp,
  LogOut,
  refreshToken,
} from '../controllers/authControllers.js';
import { refreshAuth } from '../middlewares/refreshAuth.js';
import { auth } from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(createUserSchema), SignUp);

authRouter.post('/login', validateBody(loginUserSchema), SignIn);

userRouter.get('/refresh', refreshAuth, refreshToken);
authRouter.post('/logout', auth, LogOut);

authRouter.patch(
  '/changeTheme',
  authenticate,
  isEmptyBody,
  validateBody(userChangeThemeSchema),
  authController.changeTheme
);
authRouter.post(
  '/needHelp',
  authenticate,
  isEmptyBody,
  validateBody(userHelpMailScheme),
  authController.sendNeedHelp
);
authRouter.post('/recovery-mail', isEmptyBody, authController.forgotPassword);
authRouter.patch('/reset-password', isEmptyBody, authController.resetPassword);

authRouter.get('/google-auth', authController.googleAuth);
authRouter.get('/google-redirect', authController.googleRedirect);

export default authRouter;
