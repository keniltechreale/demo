import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addAdditionalFee: (req: IRequest, res: Response) => void;
    viewAllAdditionalFees: (req: IRequest, res: Response) => void;
    updateAdditionalFee: (req: IRequest, res: Response) => void;
    deleteAdditionalFee: (req: IRequest, res: Response) => void;
};
export default _default;
