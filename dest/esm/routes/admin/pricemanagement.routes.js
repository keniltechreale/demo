import express from 'express';
import PriceManagementController from '../../controller/admin/pricemanagement.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.PriceManagement), PriceManagementController.addPriceManagement);
router.get('/', AuthGuard.verifyAdminAccessToken, PriceManagementController.viewAllPriceManagements);
router.get('/:price_id', AuthGuard.verifyAdminAccessToken, PriceManagementController.viewPriceManagementById);
router.patch('/:price_id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.PriceManagement), PriceManagementController.updatePriceManagement);
router.delete('/:price_id', AuthGuard.verifyAdminAccessToken, PriceManagementController.deletePriceManagement);
export default router;
//# sourceMappingURL=pricemanagement.routes.js.map