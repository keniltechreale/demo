"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFilefromS3 = exports.uploadFileToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const aws_config_1 = __importDefault(require("../config/aws.config"));
const getS3Object = () => {
    aws_sdk_1.default.config.update({
        accessKeyId: aws_config_1.default.accessKeyId,
        secretAccessKey: aws_config_1.default.secretAccessKey,
        region: aws_config_1.default.s3Region,
    });
    const option = {
        signatureVersion: 'v4',
        // endpoint: new AWS.Endpoint(awsConfig.s3Endpoint), // ✅ Add this
        // s3ForcePathStyle: true,
        params: {
            Bucket: aws_config_1.default.s3BucketName,
        },
    };
    return new aws_sdk_1.default.S3(option);
};
const uploadFileToS3 = (options) => {
    return new Promise((resolve, reject) => {
        const s3 = getS3Object();
        s3.putObject(options, (err, data) => {
            if (!err && data) {
                resolve(data);
            }
            else {
                reject(err);
            }
        });
    });
};
exports.uploadFileToS3 = uploadFileToS3;
const removeFilefromS3 = (options) => {
    return new Promise((resolve, reject) => {
        const s3 = getS3Object();
        s3.deleteObject(options, (err, data) => {
            if (!err && data) {
                resolve(data);
            }
            else {
                reject(err);
            }
        });
    });
};
exports.removeFilefromS3 = removeFilefromS3;
//# sourceMappingURL=aws.utils.js.map