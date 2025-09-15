"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    accessKeyId: config_1.default.AWS_ACCESS_KEY,
    secretAccessKey: config_1.default.AWS_SECRET_ACCESS,
    s3Region: config_1.default.AWS_REGION,
    s3BucketName: config_1.default.S3_BUCKET_NAME,
    // s3Endpoint: config.S3_ENDPOINT,
};
//# sourceMappingURL=aws.config.js.map