import Joi from 'joi';

import { logError } from '../utils/log-helper';
import APIError from '../exceptions/api-error';
import { VALIDATION_ERROR } from '../exceptions/exceptions.constants';

const bodyValidate = schema => (req, res, next) => {
  const invalidBody = [];
  const dataArr = !Array.isArray(req.body) ? [req.body] : req.body;
  const validBody = dataArr.filter((item) => {
    const result = Joi.validate(item, schema);
    if (result.error === null) return true;

    // add invalid data
    const invalidItem = {
      error: result.error.details,
      data: item
    };
    invalidBody.push(invalidItem);

    // log the invalid data
    const err = APIError.generateErrorMessageObject({
      error: VALIDATION_ERROR,
      data: { details: JSON.stringify(invalidItem) },
      url: req.originalUrl,
      method: req.originalMethod || req.method
    });
    logError({ label: err.statusText, message: err.message });

    return false;
  });

  req.validateBody = { validBody, invalidBody };
  next();
};

export { bodyValidate };
