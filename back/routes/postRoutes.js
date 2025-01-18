// /routes/postRoutes.js
import express from 'express';
import * as PostController from '../controllers/postController.js';
import checkAuth from '../middlewares/checkAuth.js';
import {postCreateValidation} from '../validations/validations.js';
import handelValidationsErrors from '../middlewares/handleValidationsErrors.js';
// import multer from 'multer';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({storage});
const router = express.Router();
router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
router.delete('/:id', checkAuth, PostController.remove);
router.patch(
  '/:id',
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  async (req, res) => {
    try {
      const {title, text, tags, imageUrl} = req.body; // Принимаем imageUrl из тела запроса
      // Вызываем контроллер обновления поста
      await PostController.update(req, res, imageUrl);
    } catch (err) {
      console.error('Error in route:', err);
      res.status(500).json({message: 'Failed to update post.'});
    }
  }
);
router.post(
  '/',
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  async (req, res) => {
    try {
      // const {title, text, tags, imageUrl} = req.body; // Принимаем imageUrl из тела запроса
      // Вызываем контроллер создания поста
      await PostController.create(req, res);
    } catch (err) {
      console.error('Error in route:', err);
      res.status(500).json({message: 'Failed to create post.'});
    }
  }
);
router.patch('/:id/likes', PostController.updateLikes);
export default router;
// // /routes/postRoutes.js
// import express from 'express';
// import * as PostController from '../controllers/postController.js';
// import checkAuth from '../middlewares/checkAuth.js';
// import {postCreateValidation} from '../validations/validations.js';
// import handelValidationsErrors from '../middlewares/handleValidationsErrors.js';
// import multer from 'multer';
//
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({storage});
// const router = express.Router();
// router.get('/', PostController.getAll);
// router.get('/:id', PostController.getOne);
// router.delete('/:id', checkAuth, PostController.remove);
// router.patch(
//   '/:id',
//   checkAuth,
//   upload.single('image'),
//   postCreateValidation,
//   handelValidationsErrors,
//   // PostController.update
//   async (req, res) => {
//     try {
//       const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
//       await PostController.update(req, res, imageUrl);
//     } catch (err) {
//       console.error('Error in route:', err);
//       res.status(500).json({message: 'Failed to update post.', err});
//     }
//   }
// );
// router.post(
//   '/',
//   checkAuth,
//   upload.single('image'),
//   postCreateValidation,
//   handelValidationsErrors,
//   async (req, res) => {
//     try {
//       const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
//       await PostController.create(req, res, imageUrl);
//     } catch (err) {
//       console.error('Error in route:', err);
//       res.status(500).json({message: 'Failed to create post.'});
//     }
//   }
// );
// export default router;
