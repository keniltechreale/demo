import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    GetDocuments: (req: IRequest, res: Response) => void;
    dashboard: (req: IRequest, res: Response) => void;
    ChangeConnectionStatus: (req: IRequest, res: Response) => void;
    rideRequest: (req: IRequest, res: Response) => void;
    verifyRidesOtp: (req: IRequest, res: Response) => void;
    viewCustomerInstructions: (req: IRequest, res: Response) => void;
    viewStatistics: (req: IRequest, res: Response) => void;
    DistanceCount: (req: IRequest, res: Response) => void;
};
export default _default;
