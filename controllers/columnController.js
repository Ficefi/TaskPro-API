import HttpError from '../helpers/HttpError.js';
import { Card, Column } from '../model/tasksList.js';

export const addColumn = async (req, res, next) => {
  const { title, boardId } = req.body;
  const { _id } = req.user;

  if (!title) {
    throw HttpError(400, 'Title is required');
  }

  const column = await Column.findOne({ title });

  if (column) {
    throw HttpError(400, 'This title is already used');
  }

  const taskColumn = {
    title,
    boardId,
    owner: _id,
  };

  try {
    const newColumn = await Column.create(taskColumn);

    res.status(201).send(newColumn);
  } catch (error) {
    next(error);
  }
};

export const getAllColumns = async (req, res, next) => {
  const { _id } = req.user;

  try {
    if (!_id) {
      throw HttpError(401);
    }

    const allColumns = await Column.find({ owner: _id }).populate('cards');

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
  const { id } = req.user;

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    if (column.owner._id.toString() !== id) {
      throw HttpError(400, 'Column does not belong to the specified board');
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
  const { id } = req.user;

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    if (column.owner._id.toString() !== id) {
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
  const { id } = req.user;

  try {
    const column = await Column.findById(columnId);

    if (!column) {
      throw HttpError(404);
    }

    if (column.owner._id.toString() !== id) {
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
