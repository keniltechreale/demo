import express from 'express';
import NotificationsController from '../../controller/users/misc.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.get('/', AuthGuard.verifyUserAccessToken, NotificationsController.viewAllNotifications);
router.patch('/', AuthGuard.verifyUserAccessToken, NotificationsController.updateNotifications);
router.delete('/', AuthGuard.verifyUserAccessToken, NotificationsController.deleteAllNotifications);
export default router;
//# sourceMappingURL=notifications.routes.js.map