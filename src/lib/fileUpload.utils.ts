import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction } from 'express';
import { removeFilefromS3, uploadFileToS3 } from './aws.utils';
import * as Utils from '../lib/utils';
import { IRequest } from './common.interface';
import { S3 } from 'aws-sdk';
import awsConfig from '../config/aws.config';
import { IVehicle } from '../models/vehicle.model';
import AWSUtils from '../config/aws.config';

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

export const fileUpload = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    let uploadedFileUrl: string;
    const file = req.file;
    if (file) {
      const { extension } = Utils.extractFilePath(file.originalname);
      const filepath: string = `${req.file.fieldname}/images/${uuidv4()}.${extension}`;
      uploadedFileUrl = `/${filepath}`;

      const uploadParams: S3.Types.PutObjectRequest = {
        Body: file.buffer,
        Key: filepath,
        Bucket: awsConfig.s3BucketName,
      };
      await uploadFileToS3(uploadParams);

      req.body = {
        ...req.body,
        [req.file.fieldname]: uploadedFileUrl,
      };
    }
    next();
  } catch (err) {
    res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  }
};

export const singleFileUpload = (req: IRequest, res: Response, next: NextFunction) => {
  void fileUpload(req, res, next);
};

const multiFileUploads = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { files } = req;

    const documentsArray = [];

    for (const fileKey in files) {
      if (Object.prototype.hasOwnProperty.call(files, fileKey)) {
        const fileList = files[fileKey];

        if (Array.isArray(fileList) && fileList.length > 0) {
          const filePaths: string[] = [];

          for (const file of fileList) {
            const { extension } = Utils.extractFilePath(file.originalname);
            const filepath: string = `vehicles/${fileKey}/${uuidv4()}.${extension}`;
            const uploadedFileUrl = `/${filepath}`;
            filePaths.push(uploadedFileUrl);

            const uploadParams: S3.Types.PutObjectRequest = {
              Body: file.buffer,
              Key: filepath,
              Bucket: awsConfig.s3BucketName,
            };

            await uploadFileToS3(uploadParams);
          }
          const routeDocumentList = req.documentsDetails;

          const documentInfo = routeDocumentList.find((doc) => doc.key === fileKey);
          documentsArray.push({
            title: documentInfo ? documentInfo.title : '',
            name: fileKey,
            url: filePaths,
            status: 'pending',
            reason: undefined,
          });
        }
      }
    }

    const typedDocumentsArray = documentsArray.map((doc) => ({
      ...doc,
      status: 'pending' as 'pending' | 'approved' | 'rejected',
    }));

    req.body = {
      ...req.body,
      documents: typedDocumentsArray,
    };

    next();
  } catch (err) {
    res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  }
};

export const multipleFileUpload = (req: IRequest, res: Response, next: NextFunction) => {
  void multiFileUploads(req, res, next);
};

export const MultipleImageUpload = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const uploadedFileUrls: { [key: string]: string } = {};
    const { files } = req;

    for (const fileKey in files) {
      if (Object.prototype.hasOwnProperty.call(files, fileKey)) {
        const fileList = files[fileKey];

        for (const file of fileList) {
          const { extension } = Utils.extractFilePath(file.originalname);
          const filepath: string = `assets/images/${uuidv4()}.${extension}`;
          const uploadedFileUrl: string = `/${filepath}`;

          const uploadParams: S3.Types.PutObjectRequest = {
            Body: file.buffer,
            Key: filepath,
            Bucket: awsConfig.s3BucketName,
          };
          await uploadFileToS3(uploadParams);

          uploadedFileUrls[fileKey] = uploadedFileUrl;
        }
      }
    }

    req.body = {
      ...req.body,
      ...uploadedFileUrls,
    };
    next();
  } catch (err) {
    res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  }
};

export const deleteFilesFromS3 = async (
  files: { [key: string]: Express.Multer.File[] },
  oldVehicle: IVehicle,
) => {
  for (const document of oldVehicle.documents) {
    const name = document.name;
    const deleteFiles = document.url;
    if (files[name as keyof typeof files]) {
      for (const url of deleteFiles) {
        if (url && typeof url === 'string') {
          await removeFilefromS3({
            Bucket: AWSUtils.s3BucketName,
            Key: url.replace(`/vehicles/`, `vehicles/`),
          });
        }
      }
    }
  }
};

export const deleteAllFilesFromS3 = async (oldVehicle: IVehicle) => {
  for (const document of oldVehicle.documents) {
    const urls = document.url;
    if (urls && urls.length > 0) {
      for (const uri of urls) {
        if (uri && typeof uri === 'string') {
          await removeFilefromS3({
            Bucket: AWSUtils.s3BucketName,
            Key: uri.replace(`/vehicles/`, `vehicles/`),
          });
        }
      }
    }
  }
};
