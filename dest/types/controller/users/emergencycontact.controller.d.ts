import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addEmergencyContact: (req: IRequest, res: Response) => void;
    resendOtp: (req: IRequest, res: Response) => void;
    verifyOtp: (req: IRequest, res: Response) => void;
    viewEmergencyContact: (req: IRequest, res: Response) => void;
    updateEmergencyContact: (req: IRequest, res: Response) => void;
    deleteEmergencyContact: (req: IRequest, res: Response) => void;
};
export default _default;
