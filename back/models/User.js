// /models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  avatar: {type: String}
}, {timestamps: true});
const User = mongoose.model('User', userSchema);
export default User;
