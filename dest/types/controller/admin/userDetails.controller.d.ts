import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addDriverUser: (req: IRequest, res: Response) => void;
    userCount: (req: IRequest, res: Response) => void;
    usersList: (req: IRequest, res: Response) => void;
    userDetails: (req: IRequest, res: Response) => void;
    updateVehicle: (req: IRequest, res: Response) => void;
    updateUser: (req: IRequest, res: Response) => void;
    viewVehicles: (req: IRequest, res: Response) => void;
    paymentHistory: (req: IRequest, res: Response) => void;
    deleteUser: (req: IRequest, res: Response) => void;
};
export default _default;
