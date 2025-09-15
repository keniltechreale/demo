import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addCoupon: (req: IRequest, res: Response) => void;
    viewAllCoupons: (req: IRequest, res: Response) => void;
    updateCoupon: (req: IRequest, res: Response) => void;
    deleteCoupon: (req: IRequest, res: Response) => void;
};
export default _default;
