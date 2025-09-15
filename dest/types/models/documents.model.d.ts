import { Model } from 'sequelize';
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
declare class Document extends Model implements IDocument {
    id: number;
    title: string;
    key: string;
    maxFileCounts: number;
    maxSize: number;
    description?: string;
    vehicleTypes?: number[];
    status?: boolean;
    isRequired?: boolean;
}
export default Document;
