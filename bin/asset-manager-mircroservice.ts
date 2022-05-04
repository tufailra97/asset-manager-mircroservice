#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { AssetManagerMircroserviceStack } from '../src';
import { stackEnvVariables } from '../src/helpers';

const app = new cdk.App();
new AssetManagerMircroserviceStack(app, 'AssetManagerMircroserviceStack', {
  logsEnabled: stackEnvVariables.LOG_ENABLED,
  presignedUrlLifeTime: stackEnvVariables.PRESIGNED_URL_LIFETIME.toString(),
  stage: stackEnvVariables.ENVIRONMENT,
  fileMaxSizeInBytes: stackEnvVariables.FILE_MAX_SIZE.toString(),
  env: {
    region: process.env.AWS_REGION || 'eu-west-1'
  }
});
