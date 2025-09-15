import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the document.
 *           example: "60b9d13a12b7f70001f65b15"
 *         title:
 *           type: string
 *           description: The title of the document.
 *           example: "Sample Document"
 *         key:
 *           type: string
 *           description: The key of the document.
 *           example: "sample_document"
 *         maxFileCounts:
 *           type: number
 *           description: The maximum allowed file counts for the document.
 *           example: 5
 *         maxSize:
 *           type: number
 *           description: The maximum size of the document in bytes.
 *           example: 5242880
 *         description:
 *           type: string
 *           description: Optional description of the document.
 *           example: "This is a sample document."
 */

export interface IDocument {
  vehicleTypes?: number[];
  id: number;
  title: string;
  key: string;
  maxFileCounts: number;
  maxSize: number;
  description?: string;
  isRequired?: boolean;
  status?: boolean;
}

class Document extends Model implements IDocument {
  public id!: number;
  public title!: string;
  public key!: string;
  public maxFileCounts!: number;
  public maxSize!: number;
  public description?: string;
  public vehicleTypes?: number[];
  public status?: boolean;
  public isRequired?: boolean;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxFileCounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    vehicleTypes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true,
  },
);

export default Document;
