import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    viewWallets: (req: IRequest, res: Response) => void;
    userSearch: (req: IRequest, res: Response) => void;
    transferFunds: (req: IRequest, res: Response) => void;
    walletPayment: (req: IRequest, res: Response) => void;
    WalletTipPayment: (req: IRequest, res: Response) => void;
};
export default _default;
