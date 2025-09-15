/// <reference types="node" />
/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="passport" />
import { Response, NextFunction } from 'express';
import { IRequest } from './common.interface';
import { IVehicle } from '../models/vehicle.model';
export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    stream?: ReadableStream;
    destination?: string;
    filename?: string;
    path?: string;
}
export declare const fileUpload: (req: IRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const singleFileUpload: (req: IRequest, res: Response, next: NextFunction) => void;
export declare const multipleFileUpload: (req: IRequest, res: Response, next: NextFunction) => void;
export declare const MultipleImageUpload: (req: IRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteFilesFromS3: (files: {
    [key: string]: Express.Multer.File[];
}, oldVehicle: IVehicle) => Promise<void>;
export declare const deleteAllFilesFromS3: (oldVehicle: IVehicle) => Promise<void>;
