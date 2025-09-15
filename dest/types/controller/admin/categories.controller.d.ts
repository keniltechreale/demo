import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addCategory: (req: IRequest, res: Response) => void;
    viewAllCategory: (req: IRequest, res: Response) => void;
    updateCategory: (req: IRequest, res: Response) => void;
    deleteCategory: (req: IRequest, res: Response) => void;
};
export default _default;
