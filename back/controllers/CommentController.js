// controllers/CommentController.js
import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const {postId, body} = req.body;
    const userId = req.userId;  // Получаем ID пользователя из авторизации
    const newComment = new Comment({
      postId,
      userId,
      body
    });
    const populatedComment = await newComment.populate('userId');
    res.status(201).json(populatedComment);
    await newComment.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to add comment'});
  }
};
export const getCommentsByPost = async (req, res) => {
  try {
    const {postId} = req.params;
    const comments = await Comment.find({postId}).populate('userId');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch comments'});
  }
};
export const updateComment = async (req, res) => {
  try {
    const {id} = req.params;  // ID комментария
    const {body} = req.body;  // Новое тело комментария
    const userId = req.userId;  // Получаем ID пользователя из авторизации
    // Находим комментарий по ID
    const comment = await Comment.findById(id);
    // Проверяем, что комментарий существует и что его создатель — авторизованный пользователь
    if (!comment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({message: 'You can only edit your own comments'});
    }
    // Обновляем тело комментария
    comment.body = body;
    await comment.save(); // Сохраняем обновленный комментарий
    // Отправляем обновленный комментарий обратно
    const populatedComment = await comment.populate('userId');
    res.json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to update comment'});
  }
};
// Удаление комментария
export const deleteComment = async (req, res) => {
  try {
    const {id} = req.params;  // ID комментария
    const userId = req.userId;  // Получаем ID пользователя из авторизации
    // Находим комментарий по ID
    const comment = await Comment.findById(id);
    // Проверяем, что комментарий существует и что его создатель — авторизованный пользователь
    if (!comment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({message: 'You can only delete your own comments'});
    }
    // Удаляем комментарий
    await Comment.deleteOne({_id: id});
    res.status(200).json({message: 'Comment deleted successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to delete comment'});
  }
};
