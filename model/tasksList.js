import { Schema, model } from 'mongoose';

const boardSchema = new Schema(
  {
    title: {
      type: String,
      default: null,
      required: [true, 'Set name for board'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    icon: { type: String, default: 'icon-projects' },
    background: {
      type: String,
      default: null,
    },
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
  },
  { timestamps: true, versionKey: false }
);

export const Board = model('Board', boardSchema);

const columnsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      required: [true, 'Board ID is required'],
    },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true, versionKey: false }
);

export const Column = model('Column', columnsSchema);

const cardsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['without', 'low', 'medium', 'high'],
      default: 'without',
    },
    deadline: {
      type: Date,
      default: null,
    },
    columnId: {
      type: String,
      ref: 'column',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true, versionKey: false }
);

export const Card = model('Card', cardsSchema);
