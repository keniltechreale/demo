import express from 'express';
import BlogController from '../../controller/admin/blogs.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import multer from 'multer';
import { MultipleImageUpload } from '../../lib/fileUpload.utils';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  upload.fields([{ name: 'image' }, { name: 'author_image' }]),
  MultipleImageUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Blogs),
  BlogController.addBlog,
);

router.get('/', AuthGuard.verifyAdminAccessToken, BlogController.viewAllBlogs);

router.patch(
  '/:blog_id',
  AuthGuard.verifyAdminAccessToken,
  upload.fields([{ name: 'image' }, { name: 'author_image' }]),
  MultipleImageUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Blogs),
  BlogController.updateBlog,
);

router.delete('/:blog_id', AuthGuard.verifyAdminAccessToken, BlogController.deleteBlog);

export default router;
