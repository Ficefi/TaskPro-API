import { ObjectId } from 'mongodb';
import HttpError from '../helpers/HttpError.js';
import { Board, Card, Column } from '../model/tasksList.js';

export const addBoard = async (req, res, next) => {
  const { title } = req.body;

  try {
    const board = {
      title,
      owner: req.user.id,
    };

    const newBoard = await Board.create(board);

    res.status(201).json(newBoard);
  } catch (error) {
    next(error);
  }
};

export const getAllBoards = async (req, res, next) => {
  const owner = req.user._id;

  if (!owner) {
    throw HttpError(404);
  }

  try {
    const allBoards = await Board.find({ owner }).populate('columns');

    if (!allBoards) {
      throw HttpError(404);
    }

    res.status(200).send(allBoards);
  } catch (error) {
    next(error);
  }
};

export const getOneBoard = async (req, res, next) => {
  const { boardId } = req.params;
  const owner = req.user._id;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      throw HttpError(404);
    }

    if (!board.owner || board.owner.toString() !== owner.toString()) {
      throw HttpError(400, 'Board does not belong to the specified user');
    }

    const columns = await Column.find({ boardId });

    const boardWithColumns = {
      ...board.toObject(),
      columns,
    };

    res.status(200).send({ board: boardWithColumns });
  } catch (error) {
    next(error);
  }
};

export const editBoard = async (req, res, next) => {
  const { boardId } = req.params;
  const { id } = req.user;

  try {
    console.log(boardId);
    const board = await Board.findById(boardId);
    console.log(board);

    if (!board) {
      throw HttpError(404);
    }

    // console.log(board.owner.toString());
    // console.log(id);

    if (board.owner.toString() != id) {
      throw HttpError(400, 'Board does not belong to the specified user');
    }

    const result = await Board.findByIdAndUpdate(boardId, req.body, {
      new: true,
    });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  const { boardId } = req.params;
  const { owner } = req.body;

  try {
    const board = await Board.findById(boardId);
    console.log(board);

    if (!board) {
      throw HttpError(404);
    }

    if (board.owner.toString() !== owner.toString()) {
      throw HttpError(400, 'Board does not belong to the specified user');
    }

    const result = await Board.findByIdAndDelete({
      _id: boardId,
    });

    const columns = await Column.find({ boardId });
    const columnIds = columns.map((column) => column._id);

    await Column.deleteMany({ boardId });
    await Card.deleteMany({ columnId: { $in: columnIds } });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
