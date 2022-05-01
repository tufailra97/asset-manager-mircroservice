#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AssetManagerMircroserviceStack } from '../src';

const app = new cdk.App();
new AssetManagerMircroserviceStack(app, 'AssetManagerMircroserviceStack', {
  logsEnabled: process.env.LOG_ENABLED === 'true',
  presignedUrlLifeTime: process.env.PRESIGNED_URL_LIFETIME || '0',
  stage: process.env.ENVIRONMENT || 'dev',
  fileMaxSizeInBytes: process.env.FILE_MAX_SIZE || '0'
});
