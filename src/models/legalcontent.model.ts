import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

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

class LegalContent extends Model implements ILegalContent {
  public id!: number;
  public type!: 'terms_and_conditions' | 'privacy_policy';
  public content!: string;
  public last_updated!: Date;
}

LegalContent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(50),
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LegalContent',
    tableName: 'legalcontents',
    timestamps: true,
  },
);

export default LegalContent;
