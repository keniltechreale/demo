import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addDocuments: (req: IRequest, res: Response) => void;
    viewAllDocuments: (req: IRequest, res: Response) => void;
    updateDocuments: (req: IRequest, res: Response) => void;
    deleteDocuments: (req: IRequest, res: Response) => void;
};
export default _default;
