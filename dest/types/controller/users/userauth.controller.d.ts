import { Request, Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    userRegister: (req: Request, res: Response) => void;
    resendOtp: (req: Request, res: Response) => void;
    verifyOtp: (req: Request, res: Response) => void;
    login: (req: Request, res: Response) => void;
    me: (req: IRequest, res: Response) => void;
    changePassword: (req: IRequest, res: Response) => void;
    updateProfile: (req: IRequest, res: Response) => void;
    ForgotPassword: (req: Request, res: Response) => void;
    ResetPasswords: (req: IRequest, res: Response) => void;
    deleteProfile: (req: IRequest, res: Response) => void;
    Logout: (req: IRequest, res: Response) => void;
};
export default _default;
