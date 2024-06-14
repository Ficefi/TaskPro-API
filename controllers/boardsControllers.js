import HttpError from '../helpers/index.js';
import { Board } from '../model/board.js';
import Column from '../model/column.js';
import Task from '../model/tasks.js';

export const addBoard = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Board.create({ ...req.body, owner });
  res.status(201).json(result);
};
const getByID = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Board.findOne({ _id: id, owner }).populate({
    path: 'columns',
    select: 'title boardID owner',

    populate: {
      path: 'tasks',
      select: 'title description priority deadline columnID owner',
    },
  });

  if (!result) throw HttpError(404, `Board with id=${id} not found!`);

  res.json(result);
};

const getAllBoards = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Board.find({ owner }).populate('columns', ['title']);
  res.json(result);
};

export const editBoard = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Board.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const existingBoard = await Board.findByIdAndDelete({ _id: id, owner });
  if (!existingBoard) throw HttpError(404, `Board with id=${id} not found`);

  const ownColumns = await Column.find({ boardID: id });
  const columnIDs = ownColumns.map((column) => column._id);

  await Task.deleteMany({ columnID: { $in: columnIDs } });

  await Column.deleteMany({ boardID: id });

  res.status(204).json({ message: 'Board deleted successfully' });

  try {
    const board = await Board.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!board) {
      throw HttpError(404);
    }
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};
