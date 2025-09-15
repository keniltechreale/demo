import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addBankAccounts: (req: IRequest, res: Response) => void;
    viewBankAccounts: (req: IRequest, res: Response) => void;
    updateBankAccounts: (req: IRequest, res: Response) => void;
    deleteBankAccounts: (req: IRequest, res: Response) => void;
    CashOut: (req: IRequest, res: Response) => void;
};
export default _default;
