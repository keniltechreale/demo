import express from 'express';
import TestimonialController from '../../controller/admin/testimonial.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import multer from 'multer';
import { singleFileUpload } from '../../lib/fileUpload.utils';
const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  upload.single('image'),
  singleFileUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Testimonial),
  TestimonialController.addTestimonial,
);

router.get('/', AuthGuard.verifyAdminAccessToken, TestimonialController.viewAllTestimonials);

router.patch(
  '/:testimonial_id',
  AuthGuard.verifyAdminAccessToken,
  upload.single('image'),
  singleFileUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Testimonial),
  TestimonialController.updateTestimonial,
);

router.delete(
  '/:testimonial_id',
  AuthGuard.verifyAdminAccessToken,
  TestimonialController.deleteTestimonial,
);

export default router;
