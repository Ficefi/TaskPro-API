import { updateUserData } from '../services/userServices.js';

export const changeTheme = async (req, res, next) => {
  const { theme } = req.body;
  const { id } = req.user;
  try {
    const result = await updateUserData(id, { theme });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
