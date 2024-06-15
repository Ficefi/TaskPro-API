import { updateUserData } from '../services/userServices.js';

export const changeTheme = async (req, res, next) => {
  const { theme } = req.body;
  const { id } = req.user;
  try {
    await updateUserData(id, { theme });

    res.status(200).json({
      message: `Success! Theme was changed to ${theme}`,
    });
  } catch (error) {
    next(error);
  }
};
