import AWS, { S3 } from 'aws-sdk';
import awsConfig from '../config/aws.config';

const getS3Object = () => {
  AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.s3Region,
  });

  const option: AWS.S3.Types.ClientConfiguration = {
    signatureVersion: 'v4',
    // endpoint: new AWS.Endpoint(awsConfig.s3Endpoint), // ✅ Add this
    // s3ForcePathStyle: true,
    params: {
      Bucket: awsConfig.s3BucketName,
    },
  };
  return new AWS.S3(option);
};

export const uploadFileToS3 = (options: S3.Types.PutObjectRequest): Promise<S3.PutObjectOutput> => {
  return new Promise((resolve, reject) => {
    const s3 = getS3Object();
    s3.putObject(options, (err, data) => {
      if (!err && data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

export const removeFilefromS3 = (
  options: S3.Types.DeleteObjectRequest,
): Promise<S3.Types.DeleteObjectOutput> => {
  return new Promise((resolve, reject) => {
    const s3 = getS3Object();
    s3.deleteObject(options, (err, data) => {
      if (!err && data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};
