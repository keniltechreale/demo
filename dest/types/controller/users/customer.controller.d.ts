import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    ViewDashboard: (req: IRequest, res: Response) => void;
    AvailableVehicleCategories: (req: IRequest, res: Response) => void;
    selectDrivers: (req: IRequest, res: Response) => void;
    addInstructions: (req: IRequest, res: Response) => void;
    VerifyCoupon: (req: IRequest, res: Response) => void;
    redeemCoupon: (req: IRequest, res: Response) => void;
};
export default _default;
