// /models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  text: {type: String, required: true, unique: true},
  tags: {type: [], default: []},
  viewsCount: {type: Number, default: 0},
  positiveLikes: {type: Number, default: 0},
  negativeLikes: {type: Number, default: 0},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  imageUrl: {type: String},
}, {timestamps: true});
const Post = mongoose.model('Post', postSchema);
export default Post;
