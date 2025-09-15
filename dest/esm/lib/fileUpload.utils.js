var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import { removeFilefromS3, uploadFileToS3 } from './aws.utils';
import * as Utils from '../lib/utils';
import awsConfig from '../config/aws.config';
import AWSUtils from '../config/aws.config';
export const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uploadedFileUrl;
        const file = req.file;
        if (file) {
            const { extension } = Utils.extractFilePath(file.originalname);
            const filepath = `${req.file.fieldname}/images/${uuidv4()}.${extension}`;
            uploadedFileUrl = `/${filepath}`;
            const uploadParams = {
                Body: file.buffer,
                Key: filepath,
                Bucket: awsConfig.s3BucketName,
            };
            yield uploadFileToS3(uploadParams);
            req.body = Object.assign(Object.assign({}, req.body), { [req.file.fieldname]: uploadedFileUrl });
        }
        next();
    }
    catch (err) {
        res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
});
export const singleFileUpload = (req, res, next) => {
    void fileUpload(req, res, next);
};
const multiFileUploads = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files } = req;
        const documentsArray = [];
        for (const fileKey in files) {
            if (Object.prototype.hasOwnProperty.call(files, fileKey)) {
                const fileList = files[fileKey];
                if (Array.isArray(fileList) && fileList.length > 0) {
                    const filePaths = [];
                    for (const file of fileList) {
                        const { extension } = Utils.extractFilePath(file.originalname);
                        const filepath = `vehicles/${fileKey}/${uuidv4()}.${extension}`;
                        const uploadedFileUrl = `/${filepath}`;
                        filePaths.push(uploadedFileUrl);
                        const uploadParams = {
                            Body: file.buffer,
                            Key: filepath,
                            Bucket: awsConfig.s3BucketName,
                        };
                        yield uploadFileToS3(uploadParams);
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
        const typedDocumentsArray = documentsArray.map((doc) => (Object.assign(Object.assign({}, doc), { status: 'pending' })));
        req.body = Object.assign(Object.assign({}, req.body), { documents: typedDocumentsArray });
        next();
    }
    catch (err) {
        res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
});
export const multipleFileUpload = (req, res, next) => {
    void multiFileUploads(req, res, next);
};
export const MultipleImageUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFileUrls = {};
        const { files } = req;
        for (const fileKey in files) {
            if (Object.prototype.hasOwnProperty.call(files, fileKey)) {
                const fileList = files[fileKey];
                for (const file of fileList) {
                    const { extension } = Utils.extractFilePath(file.originalname);
                    const filepath = `assets/images/${uuidv4()}.${extension}`;
                    const uploadedFileUrl = `/${filepath}`;
                    const uploadParams = {
                        Body: file.buffer,
                        Key: filepath,
                        Bucket: awsConfig.s3BucketName,
                    };
                    yield uploadFileToS3(uploadParams);
                    uploadedFileUrls[fileKey] = uploadedFileUrl;
                }
            }
        }
        req.body = Object.assign(Object.assign({}, req.body), uploadedFileUrls);
        next();
    }
    catch (err) {
        res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
});
export const deleteFilesFromS3 = (files, oldVehicle) => __awaiter(void 0, void 0, void 0, function* () {
    for (const document of oldVehicle.documents) {
        const name = document.name;
        const deleteFiles = document.url;
        if (files[name]) {
            for (const url of deleteFiles) {
                if (url && typeof url === 'string') {
                    yield removeFilefromS3({
                        Bucket: AWSUtils.s3BucketName,
                        Key: url.replace(`/vehicles/`, `vehicles/`),
                    });
                }
            }
        }
    }
});
export const deleteAllFilesFromS3 = (oldVehicle) => __awaiter(void 0, void 0, void 0, function* () {
    for (const document of oldVehicle.documents) {
        const urls = document.url;
        if (urls && urls.length > 0) {
            for (const uri of urls) {
                if (uri && typeof uri === 'string') {
                    yield removeFilefromS3({
                        Bucket: AWSUtils.s3BucketName,
                        Key: uri.replace(`/vehicles/`, `vehicles/`),
                    });
                }
            }
        }
    }
});
//# sourceMappingURL=fileUpload.utils.js.map