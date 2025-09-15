import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    UpdateLegalContent: (req: IRequest, res: Response) => void;
    viewLegalContent: (req: IRequest, res: Response) => void;
    viewAllNotifications: (req: IRequest, res: Response) => void;
    updateNotifications: (req: IRequest, res: Response) => void;
    viewContactUsUsers: (req: IRequest, res: Response) => void;
    sendContactUsReply: (req: IRequest, res: Response) => void;
};
export default _default;
