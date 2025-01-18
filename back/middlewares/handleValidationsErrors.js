// /middleware/handleValidationsErrors.js
import {validationResult} from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Логируем ошибки
    return res.status(400).json({errors: errors.array()});
  }
  next();
}
