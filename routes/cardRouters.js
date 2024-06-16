import express from 'express';
import {
  addCard,
  deleteCard,
  editCard,
  getAllCards,
  getOneCard,
} from '../controllers/cardController.js';
import { auth } from '../middlewares/authenticate.js';

const cardRouter = express.Router();

cardRouter.post('/', auth, addCard);
cardRouter.put('/:cardId', auth, editCard);
cardRouter.delete('/:cardId', auth, deleteCard);
cardRouter.get('/', auth, getAllCards);
cardRouter.get('/:cardId', auth, getOneCard);

export default cardRouter;
