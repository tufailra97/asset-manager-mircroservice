#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AssetManagerMircroserviceStack } from '../lib/asset-manager-mircroservice-stack';

const app = new cdk.App();
new AssetManagerMircroserviceStack(app, 'AssetManagerMircroserviceStack', {});
