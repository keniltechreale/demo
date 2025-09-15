import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    viewWallets: (req: IRequest, res: Response) => void;
    AddedToWallet: (req: IRequest, res: Response) => void;
    RemovedFromWAllet: (req: IRequest, res: Response) => void;
    PaymentHistory: (req: IRequest, res: Response) => void;
};
export default _default;
