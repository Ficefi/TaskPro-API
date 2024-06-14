import Joi from 'joi';
import { Schema, model } from 'mongoose';
import { handleSaveError, preUpdate } from './hooks.js';

export const columnScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'task',
      },
    ],

    boardID: {
      type: Schema.Types.ObjectId,
      ref: 'board',
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },

  { versionKey: false, timestamps: false }
);

columnScheme.post('save', handleSaveError);
columnScheme.pre('findOneAndUpdate', preUpdate);
columnScheme.post('findOneAndUpdate', handleSaveError);

export const columnAddSchema = Joi.object({
  title: Joi.string().max(32).required(),
});

export const columnEditSchema = Joi.object({
  title: Joi.string().max(32),
});

const Column = model('column', columnScheme);

export default Column;
