import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    AddFeedbacks: (req: IRequest, res: Response) => void;
    ViewAllFeedbacks: (req: IRequest, res: Response) => void;
    UpdateFeedbacks: (req: IRequest, res: Response) => void;
    DeleteFeedbacks: (req: IRequest, res: Response) => void;
};
export default _default;
