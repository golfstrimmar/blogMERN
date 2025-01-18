import express from 'express';
import * as CommentController from '../controllers/CommentController.js';
import checkAuth from '../middlewares/checkAuth.js';  // Проверка авторизации
const router = express.Router();
// Получение комментариев для поста
router.get('/:postId', CommentController.getCommentsByPost);
// Добавление комментария (только для авторизованных пользователей)
router.post('/', checkAuth, CommentController.addComment);
// Обновление комментария (только для авторизованных пользователей)
router.put('/:id', checkAuth, CommentController.updateComment);
// Удаление комментария (только для авторизованных пользователей)
router.delete('/:id', checkAuth, CommentController.deleteComment);
export default router;