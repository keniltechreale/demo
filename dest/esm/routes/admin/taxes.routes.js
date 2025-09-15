import express from 'express';
import TaxesController from '../../controller/admin/taxes.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.get('/', AuthGuard.verifyAdminAccessToken, TaxesController.viewTaxes);
router.patch('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Taxes), TaxesController.updateTaxes);
export default router;
//# sourceMappingURL=taxes.routes.js.map