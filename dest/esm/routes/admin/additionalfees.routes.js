import express from 'express';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import AdditionalFeesController from '../../controller/admin/additionalfees.controller';
const router = express.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.AdditionalFee), AdditionalFeesController.addAdditionalFee);
router.get('/', AuthGuard.verifyAdminAccessToken, AdditionalFeesController.viewAllAdditionalFees);
router.patch('/:id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.AdditionalFee), AdditionalFeesController.updateAdditionalFee);
router.delete('/:id', AuthGuard.verifyAdminAccessToken, AdditionalFeesController.deleteAdditionalFee);
export default router;
//# sourceMappingURL=additionalfees.routes.js.map