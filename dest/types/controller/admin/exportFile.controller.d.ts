import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    ExportCSVFiles: (req: IRequest, res: Response) => Promise<void>;
    ExportExcelFiles: (req: IRequest, res: Response) => Promise<void>;
};
export default _default;
