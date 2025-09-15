import express from 'express';
import NotificationsController from '../../controller/admin/legalcontent.controller';
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

router.get('/', AuthGuard.verifyAdminAccessToken, NotificationsController.viewAllNotifications);
router.patch(
  '/:notify_id',
  AuthGuard.verifyAdminAccessToken,
  NotificationsController.updateNotifications,
);
export default router;
