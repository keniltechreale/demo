import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    viewAllReferrals: (req: IRequest, res: Response) => void;
    updateReferral: (req: IRequest, res: Response) => void;
    deleteReferral: (req: IRequest, res: Response) => void;
};
export default _default;
