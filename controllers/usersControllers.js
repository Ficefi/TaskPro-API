import HttpError from '../helpers/HttpError.js';
import {
  findUserByToken,
  updateUserData,
  sendMail,
} from '../services/userServices.js';

export const userCurrent = async (req, res, next) => {
  const { accessToken } = req.user;
  try {
    const user = await findUserByToken(accessToken);
    console.log(user);
    const { name, email, theme, avatarURL } = user;

    if (!user) {
      throw HttpError(401, 'User doesn`t exist');
    }

    res.status(200).json({
      name,
      email,
      theme,
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export const userUpdate = async (req, res, next) => {
  const { id } = req.user;
  const data = req.body;
  try {
    if (req.file) {
      const avatarURL = req.file.path;
      var user = await updateUserData(id, { data, avatarURL });
    } else {
      var user = await updateUserData(id, data);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const userHelpRequest = async (req, res, next) => {
  const { sender, comment } = req.body;
  try {
    await sendMail(sender, comment);

    res.status(200).json({ message: 'Mail was sent' });
  } catch (error) {
    next(error);
  }
};
