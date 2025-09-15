import express from 'express';
import ReferralController from '../../controller/admin/referral.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';


const router = express.Router();

router.get('/', AuthGuard.verifyAdminAccessToken, ReferralController.viewAllReferrals);

router.patch(
  '/:referral_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Referral),
  ReferralController.updateReferral,
);

// DELETE: Delete a referral by ID
router.delete('/:referral_id', AuthGuard.verifyAdminAccessToken, ReferralController.deleteReferral);

export default router;
