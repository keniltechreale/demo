import { Model } from 'sequelize';
/**
 * @swagger
 * components:
 *   schemas:
 *     LegalContent:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the legal content.
 *           example: "60b9d13a12b7f70001f65b15"
 *         type:
 *           type: string
 *           description: The type of legal content (terms_and_conditions or privacy_policy).
 *           example: "terms_and_conditions"
 *         content:
 *           type: string
 *           description: The actual text content of the legal document.
 *           example: "These are the terms and conditions..."
 *         last_updated:
 *           type: string
 *           format: date-time
 *           description: The date and time when the legal content was last updated.
 *           example: "2024-01-10T12:34:56Z"
 */
export interface ILegalContent {
    id: number;
    type: 'terms_and_conditions' | 'privacy_policy';
    content: string;
    last_updated: Date;
}
declare class LegalContent extends Model implements ILegalContent {
    id: number;
    type: 'terms_and_conditions' | 'privacy_policy';
    content: string;
    last_updated: Date;
}
export default LegalContent;
