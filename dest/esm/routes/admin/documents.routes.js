import express from 'express';
import DocumentsController from '../../controller/admin/documents.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Documents), DocumentsController.addDocuments);
router.get('/', AuthGuard.verifyAdminAccessToken, DocumentsController.viewAllDocuments);
router.patch('/:documents_id', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Documents), DocumentsController.updateDocuments);
router.delete('/:documents_id', AuthGuard.verifyAdminAccessToken, DocumentsController.deleteDocuments);
export default router;
//# sourceMappingURL=documents.routes.js.map