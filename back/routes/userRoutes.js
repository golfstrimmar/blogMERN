import express from 'express';
import * as UserController from '../controllers/UserController.js';
import {loginValidation, registerValidation} from '../validations/validations.js';
import handelValidationsErrors from '../middlewares/handleValidationsErrors.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();
router.get('/me', checkAuth, UserController.getMe);
router.get('/:userId', UserController.getUserById);
router.post('/register', registerValidation, handelValidationsErrors, (req, res, next) => {
  console.log('Register request data:', req.body);
  next();
}, UserController.register);
router.post('/login', loginValidation, handelValidationsErrors, UserController.login);
export default router;