// /validations.js
import {body} from 'express-validator';

export const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
];
export const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
  body('fullName').isLength({min: 3}).withMessage('Full name must be at least 3 characters'),
];
export const postCreateValidation = [
  body('title').isLength({min: 3}).isString().withMessage('Enter post title'),
  body('text').isLength({min: 10}).isString().withMessage('Enter post text'),
  body('tags').optional().isString().withMessage('Invalid tag format'),
];
