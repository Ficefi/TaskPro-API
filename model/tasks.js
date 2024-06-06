import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, preUpdate } from './hooks.js';

const priorityList = ['Without', 'Low', 'Medium', 'High'];

const taskScheme = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for task'],
    },

    description: {
      type: String,
      default: '',
    },

    priority: {
      type: String,
      enum: priorityList,
      default: 'Without',
    },

    deadline: {
      type: String,
    },

    columnID: {
      type: Schema.Types.ObjectId,
      ref: 'column',
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

taskScheme.post('save', handleSaveError);
taskScheme.pre('findOneAndUpdate', preUpdate);

export const taskAddSchema = Joi.object({
  title: Joi.string().max(32).required(),
  description: Joi.string().max(88).allow(''),
  priority: Joi.string().valid(...priorityList),
  deadline: Joi.string(),
});

export const taskEditSchema = Joi.object({
  title: Joi.string().max(32).allow('').optional(),
  description: Joi.string().max(88).allow('').optional(),
  priority: Joi.string()
    .valid(...priorityList)
    .optional(),
  deadline: Joi.string().optional(),
  columnID: Joi.string().optional(),
});

export const taskChangeColumnSchema = Joi.object({
  columnID: Joi.string().required(),
});

const Task = model('task', taskScheme);

export default Task;
