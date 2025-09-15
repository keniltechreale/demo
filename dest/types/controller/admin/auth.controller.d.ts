import { Request, Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    login: (req: Request, res: Response) => void;
    me: (req: IRequest, res: Response) => void;
    forgotPassword: (req: Request, res: Response) => void;
    verifyOtp: (req: IRequest, res: Response) => void;
    resetPassword: (req: IRequest, res: Response) => void;
};
export default _default;
