// /controllers/UserController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    const doc = new User(
      {
        email: req.body.email,
        fullName: req.body.fullName,
        avatar: req.body.avatar,
        passwordHash: pass,
      }
    );
    const user = await doc.save();
    const token = jwt.sign({_id: user._id}, 'secret123', {expiresIn: '30d'});
    const {passwordHash, ...userData} = user._doc;
    res.json({userData, token})
  } catch (err) {
    console.log(err)
    res.status(500).json({message: 'Registration falled.'} + err)
  }
}
export const login = async (req, res) => {
  try {
    const user = await User.findOne(
      {
        email: req.body.email,
      }
    )
    if (!user) {
      return res.status(404).json({message: 'Invalid Credentials'})
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({message: 'Invalid Credentials'})
    }
    const token = jwt.sign({_id: user._id}, 'secret123', {expiresIn: '30d'});
    const {passwordHash, ...userData} = user._doc;
    res.json({userData, token})
  } catch (err) {
    console.log(err)
    res.status(500).json({message: 'Registration failed.'})
  }
}
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      console.log('User not found, sending 404 response.')
      return res.status(404).json({error: 'No user found.'})
    }
    const {passwordHash, ...userData} = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'There is no access.'
    })
  }
}
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);  // Ищем пользователя по ID
    if (!user) {
      return res.status(404).json({message: 'User not found'});  // Если пользователь не найден
    }
    const {passwordHash, ...userData} = user._doc;  // Оставляем все, кроме пароля
    res.json(userData);  // Отправляем данные о пользователе
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});  // В случае ошибки
  }
};