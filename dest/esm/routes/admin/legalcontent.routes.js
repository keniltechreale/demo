import express from 'express';
import LegalContentController from '../../controller/admin/legalcontent.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin Legal content
 *   description: API endpoints for user authentication
 */
/**
 * @swagger
 * /api/v1/admin/legalcontent/{type}:
 *   get:
 *     summary: Get Legal content
 *     tags: [Admin Legal content]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved terms and conditions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Terms and conditions content
 *                 last_updated:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the terms and conditions were last updated
 *                   example: "2024-01-10T12:34:56Z"
 *       '401':
 *         description: Unauthorized. Authentication required
 *       '403':
 *         description: Forbidden. User does not have permission
 *       '500':
 *         description: Internal server error
 */
router.get('/:type', AuthGuard.verifyAdminAccessToken, LegalContentController.viewLegalContent);
/**
 * @swagger
 * /api/v1/admin/legalcontent/{type}:
 *   patch:
 *     summary: Update Legal content
 *     tags: [Admin Legal content]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: New terms and conditions content
 *             required:
 *               - content
 *     responses:
 *       '200':
 *         description: Successfully updated terms and conditions
 *       '400':
 *         description: Bad request. Invalid input data
 *       '401':
 *         description: Unauthorized. Authentication required
 *       '403':
 *         description: Forbidden. User does not have permission
 *       '500':
 *         description: Internal server error
 */
router.patch('/:type', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.LegalContent), LegalContentController.UpdateLegalContent);
export default router;
//# sourceMappingURL=legalcontent.routes.js.map