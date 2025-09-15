import express from 'express';
import FAQsController from '../../controller/admin/faqs.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.FAQs), FAQsController.addFAQs);
router.get('/', AuthGuard.verifyAdminAccessToken, FAQsController.viewAllFAQs);
router.patch('/:faqs_id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.FAQs), FAQsController.updateFAQs);
router.delete('/:faqs_id', AuthGuard.verifyAdminAccessToken, FAQsController.deleteFAQs);
export default router;
//# sourceMappingURL=faqs.routes.js.map