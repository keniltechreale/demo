import express from 'express';
import ConatctUsController from '../../controller/admin/legalcontent.controller';
import * as AuthGuard from '../../middleware/authGard';
import ValidationMiddleware from '../../middleware/validation.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Contact Us User Details
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/v1/admin/conatct-us:
 *   get:
 *     summary: Get Contact Us User Details
 *     tags: [Admin Contact Us User Details]
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
 *                   _id: "661e6442cfc7868cd839427a"
 *                   full_name: "John ODe"
 *                   email: "abc@gmail.com"
 *                   phone_number: "+9754345787"
 *                   message: "helloo ..."
 *                   createdAt: "2024-04-16T11:42:58.148Z"
 *                   updatedAt: "2024-04-16T11:42:58.148Z"
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

router.get('/', AuthGuard.verifyAdminAccessToken, ConatctUsController.viewContactUsUsers);
router.post(
  '/:contactus_id',
  AuthGuard.verifyAdminAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.LegalContent),
  ConatctUsController.sendContactUsReply,
);
export default router;
