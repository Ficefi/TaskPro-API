import Joi from 'joi';
import moment from 'moment';

export const dateCardSchema = Joi.object({
  deadline: Joi.string().custom((value, helpers) => {
    if (!moment(value, 'DD.MM', true).isValid()) {
      return helpers.error('any.invalid', {
        message: 'Invalid date format. Use DD.MM',
      });
    }
    return value;
  }),
});
