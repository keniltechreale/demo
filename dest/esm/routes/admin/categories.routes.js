import express from 'express';
import CategoryController from '../../controller/admin/categories.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import multer from 'multer';
import * as AuthGuard from '../../middleware/authGard';
import { singleFileUpload } from '../../lib/fileUpload.utils';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/:type', AuthGuard.verifyAdminAccessToken, upload.single('image'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.Category), CategoryController.addCategory);
router.get('/:type', AuthGuard.verifyAdminAccessToken, CategoryController.viewAllCategory);
router.patch('/:type/:category_id', AuthGuard.verifyAdminAccessToken, upload.single('image'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.Category), CategoryController.updateCategory);
router.delete('/:type/:category_id', AuthGuard.verifyAdminAccessToken, CategoryController.deleteCategory);
export default router;
//# sourceMappingURL=categories.routes.js.map