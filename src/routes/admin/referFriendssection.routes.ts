import express from 'express';
import ReferFriendsController from '../../controller/admin/referfriendsection.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.patch(
  '/:type',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.ReferFriends),
  ReferFriendsController.UpdateReferFriends,
);

router.get('/', AuthGuard.verifyAdminAccessToken, ReferFriendsController.viewReferFriends);

export default router;
