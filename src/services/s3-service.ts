import { S3 } from 'aws-sdk';

export const s3Service = new S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
});
