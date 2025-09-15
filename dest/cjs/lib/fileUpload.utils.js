"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllFilesFromS3 = exports.deleteFilesFromS3 = exports.MultipleImageUpload = exports.multipleFileUpload = exports.singleFileUpload = exports.fileUpload = void 0;
const uuid_1 = require("uuid");
const aws_utils_1 = require("./aws.utils");
const Utils = __importStar(require("../lib/utils"));
const aws_config_1 = __importDefault(require("../config/aws.config"));
const aws_config_2 = __importDefault(require("../config/aws.config"));
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uploadedFileUrl;
        const file = req.file;
        if (file) {
            const { extension } = Utils.extractFilePath(file.originalname);
            const filepath = `${req.file.fieldname}/images/${(0, uuid_1.v4)()}.${extension}`;
            uploadedFileUrl = `/${filepath}`;
            const uploadParams = {
                Body: file.buffer,
                Key: filepath,
                Bucket: aws_config_1.default.s3BucketName,
            };
            yield (0, aws_utils_1.uploadFileToS3)(uploadParams);
            req.body = Object.assign(Object.assign({}, req.body), { [req.file.fieldname]: uploadedFileUrl });
        }
        next();
    }
    catch (err) {
        res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
});
exports.fileUpload = fileUpload;
const singleFileUpload = (req, res, next) => {
    void (0, exports.fileUpload)(req, res, next);
};
exports.singleFileUpload = singleFileUpload;
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
                        const filepath = `vehicles/${fileKey}/${(0, uuid_1.v4)()}.${extension}`;
                        const uploadedFileUrl = `/${filepath}`;
                        filePaths.push(uploadedFileUrl);
                        const uploadParams = {
                            Body: file.buffer,
                            Key: filepath,
                            Bucket: aws_config_1.default.s3BucketName,
                        };
                        yield (0, aws_utils_1.uploadFileToS3)(uploadParams);
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
const multipleFileUpload = (req, res, next) => {
    void multiFileUploads(req, res, next);
};
exports.multipleFileUpload = multipleFileUpload;
const MultipleImageUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFileUrls = {};
        const { files } = req;
        for (const fileKey in files) {
            if (Object.prototype.hasOwnProperty.call(files, fileKey)) {
                const fileList = files[fileKey];
                for (const file of fileList) {
                    const { extension } = Utils.extractFilePath(file.originalname);
                    const filepath = `assets/images/${(0, uuid_1.v4)()}.${extension}`;
                    const uploadedFileUrl = `/${filepath}`;
                    const uploadParams = {
                        Body: file.buffer,
                        Key: filepath,
                        Bucket: aws_config_1.default.s3BucketName,
                    };
                    yield (0, aws_utils_1.uploadFileToS3)(uploadParams);
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
exports.MultipleImageUpload = MultipleImageUpload;
const deleteFilesFromS3 = (files, oldVehicle) => __awaiter(void 0, void 0, void 0, function* () {
    for (const document of oldVehicle.documents) {
        const name = document.name;
        const deleteFiles = document.url;
        if (files[name]) {
            for (const url of deleteFiles) {
                if (url && typeof url === 'string') {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_2.default.s3BucketName,
                        Key: url.replace(`/vehicles/`, `vehicles/`),
                    });
                }
            }
        }
    }
});
exports.deleteFilesFromS3 = deleteFilesFromS3;
const deleteAllFilesFromS3 = (oldVehicle) => __awaiter(void 0, void 0, void 0, function* () {
    for (const document of oldVehicle.documents) {
        const urls = document.url;
        if (urls && urls.length > 0) {
            for (const uri of urls) {
                if (uri && typeof uri === 'string') {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_2.default.s3BucketName,
                        Key: uri.replace(`/vehicles/`, `vehicles/`),
                    });
                }
            }
        }
    }
});
exports.deleteAllFilesFromS3 = deleteAllFilesFromS3;
//# sourceMappingURL=fileUpload.utils.js.map