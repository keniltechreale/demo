import { S3 } from 'aws-sdk';
export declare const uploadFileToS3: (options: S3.Types.PutObjectRequest) => Promise<S3.PutObjectOutput>;
export declare const removeFilefromS3: (options: S3.Types.DeleteObjectRequest) => Promise<S3.Types.DeleteObjectOutput>;
