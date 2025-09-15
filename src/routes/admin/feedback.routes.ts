import express from 'express';
import FeedbackController from '../../controller/admin/feedback.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.FeedBack),
  FeedbackController.AddFeedbacks,
);

router.get('/', AuthGuard.verifyAdminAccessToken, FeedbackController.ViewAllFeedbacks);

router.patch(
  '/:feedback_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.FeedBack),
  FeedbackController.UpdateFeedbacks,
);

router.delete(
  '/:feedback_id',
  AuthGuard.verifyAdminAccessToken,
  FeedbackController.DeleteFeedbacks,
);

export default router;
