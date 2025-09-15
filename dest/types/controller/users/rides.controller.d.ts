import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addRides: (req: IRequest, res: Response) => void;
    viewRides: (req: IRequest, res: Response) => void;
    viewRidesById: (req: IRequest, res: Response) => void;
    updateRides: (req: IRequest, res: Response) => void;
    deleteRides: (req: IRequest, res: Response) => void;
    DownloadPdf: (req: IRequest, res: Response) => void;
    country: (req: IRequest, res: Response) => void;
    AddCountry: (req: IRequest, res: Response) => void;
};
export default _default;
