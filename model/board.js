import Joi from 'joi';
import { Schema, model } from 'mongoose';
import { handleSaveError, preUpdate } from './hooks.js';

const boardScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    background: {
      type: String,
    },

    icon: {
      type: String,
      default: 'icon-Project',
    },

    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'column',
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },

  { versionKey: false, timestamps: false }
);

boardScheme.post('save', handleSaveError);
boardScheme.pre('findOneAndUpdate', preUpdate);
boardScheme.post('findOneAndUpdate', handleSaveError);

export const boardAddSchema = Joi.object({
  title: Joi.string().max(32).required(),
  background: Joi.string(),
  icon: Joi.string(),
});

export const boardEditSchema = Joi.object({
  title: Joi.string().max(32),
  background: Joi.string(),
  icon: Joi.string(),
});

const Board = model('board', boardScheme);

export default Board;
