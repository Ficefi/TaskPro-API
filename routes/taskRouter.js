import express from 'express';
import tasksController from '../controllers/tasksController.js';
import {
  taskAddSchema,
  taskChangeColumnSchema,
  taskEditSchema,
} from '../models/Tasks.js';
import {
  isEmptyBody,
  authenticate,
  isValidateId,
} from '../middlewares/index.js';

const tasksRouter = express.Router();

tasksRouter.use(authenticate);
tasksRouter.post(
  '/:id',
  isValidateId,
  isEmptyBody,
  validateBody(taskAddSchema),
  tasksController.addTask
);
tasksRouter.get('/', tasksController.getAllTasks);
tasksRouter.put(
  '/:id',
  isValidateId,
  isEmptyBody,
  validateBody(taskEditSchema),
  tasksController.editTask
);
tasksRouter.patch(
  '/:id',
  isValidateId,
  isEmptyBody,
  validateBody(taskChangeColumnSchema),
  tasksController.changeColumn
);
tasksRouter.patch(
  '/dnd/:id',
  isValidateId,
  isEmptyBody,
  tasksController.dndMovement
);
tasksRouter.delete('/:id', isValidateId, tasksController.deleteTask);
