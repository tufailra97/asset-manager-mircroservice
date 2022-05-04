import {
  aws_apigateway,
  aws_iam,
  aws_lambda_nodejs,
  aws_s3,
  Duration,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

interface AssetManagerMircroserviceStackProps extends StackProps {
  readonly stage: string;
  readonly logsEnabled: boolean;
  readonly fileMaxSizeInBytes: string;
  readonly presignedUrlLifeTime: string;
}

export class AssetManagerMircroserviceStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: AssetManagerMircroserviceStackProps
  ) {
    super(scope, id, props);

    console.log({ props });

    if (!props || !Object.keys(props).length) {
      throw new Error('Missing props');
    }

    const bucket = new aws_s3.Bucket(
      this,
      `asset-manager-bucket-${props.stage}`,
      {
        bucketName: `asset-manager-bucket-${props.stage}`,
        accessControl: aws_s3.BucketAccessControl.PRIVATE,
        publicReadAccess: false
      }
    );

    const lambdaS3PutObject = new aws_iam.PolicyStatement();

    lambdaS3PutObject.addActions('s3:PutObject');
    lambdaS3PutObject.addResources(`${bucket.bucketArn}/*`);

    const lambdaCreatePresignedUrl = new aws_lambda_nodejs.NodejsFunction(
      this,
      `get-presigned-url-${props.stage}`,
      {
        functionName: `get-presigned-url-${props.stage}`,
        runtime: Runtime.NODEJS_14_X,
        entry: path.join(
          __dirname,
          '../handlers/create-presigned-url/create-presigned-url.ts'
        ),
        memorySize: 128,
        timeout: Duration.seconds(10),
        environment: {
          BUCKET_NAME: bucket.bucketName,
          PRESIGNED_URL_LIFETIME: props.presignedUrlLifeTime,
          FILE_MAX_SIZE: props.fileMaxSizeInBytes,
          LOG_ENABLED: props.logsEnabled ? 'true' : 'false'
        },
        logRetention: RetentionDays.ONE_DAY,
        initialPolicy: [lambdaS3PutObject]
      }
    );

    const apiGateway = new aws_apigateway.RestApi(
      this,
      `asset-manager-api-${props.stage}`,
      {
        restApiName: `Asset Manager API - ${props.stage.toUpperCase()}`,
        description: 'Asset Manager API'
      }
    );

    apiGateway.root
      .addResource('get-presigned-url')
      .addMethod(
        'POST',
        new aws_apigateway.LambdaIntegration(lambdaCreatePresignedUrl)
      );
  }
}
