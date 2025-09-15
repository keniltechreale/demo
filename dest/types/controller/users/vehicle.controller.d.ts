import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addVehicle: (req: IRequest, res: Response) => void;
    viewVehicles: (req: IRequest, res: Response) => void;
    updateVehicle: (req: IRequest, res: Response) => void;
    deleteVehicle: (req: IRequest, res: Response) => void;
};
export default _default;
