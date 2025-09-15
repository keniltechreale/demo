import { IDocument } from '../../models/documents.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addDocuments(args: Record<string, unknown>): Promise<{
        message: string;
        documents: IDocument;
    }>;
    getAllDocuments(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        documents: {
            vehicleTypes: any[];
            id: number;
            title: string;
            key: string;
            maxFileCounts: number;
            maxSize: number;
            description?: string;
            status?: boolean;
            isRequired?: boolean;
            _attributes: any;
            dataValues: any;
            _creationAttributes: any;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<any, any>;
        }[];
    }>;
    updateDocuments(args: Record<string, unknown>, documentsId: string): Promise<{
        message: string;
        documents: IDocument;
    }>;
    deleteDocuments(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
