import HttpError from '../helpers/HttpError.js';
import { Card, Column } from '../model/tasksList.js';

export const addColumn = async (req, res, next) => {
  const { title, boardId } = req.body;
  if (!title) {
    return res.status(400).send({ message: 'Title is required' });
  }

  const taskColumn = {
    title,
    boardId,
  };

  try {
    const newColumn = await Column.create(taskColumn);

    res.status(201).send(newColumn);
  } catch (error) {
    next(error);
  }
};

export const getAllColumns = async (req, res, next) => {
  const { boardId } = req.body;

  try {
    if (!boardId) {
      throw HttpError(400);
    }

    const allColumns = await Column.find({ boardId }).populate('cards');

    if (!allColumns) {
      throw HttpError(404);
    }

    res.status(200).send(allColumns);
  } catch (error) {
    next(error);
  }
};

export const getOneColumn = async (req, res, next) => {
  const { columnId } = req.params;

  if (!columnId) {
    throw HttpError(404);
  }

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    const cards = await Card.find({ columnId });

    const columnWithCards = {
      ...column.toObject(),
      cards: cards,
    };

    res.status(200).send({ column: columnWithCards });
  } catch (error) {
    next(error);
  }
};

export const editColumn = async (req, res, next) => {
  const { columnId } = req.params;
  const { boardId } = req.body;

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    if (column.boardId.toString() !== boardId.toString()) {
      throw HttpError(400, 'Column does not belong to the specified board');
    }

    const result = await Column.findByIdAndUpdate(columnId, req.body, {
      new: true,
    });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (req, res, next) => {
  const { columnId } = req.params;
  const { boardId } = req.body;

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    if (column.boardId.toString() !== boardId.toString()) {
      throw HttpError(400, 'Column does not belong to the specified board');
    }

    const result = await Column.findByIdAndDelete({
      _id: columnId,
    });

    await Card.deleteMany({ columnId });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
