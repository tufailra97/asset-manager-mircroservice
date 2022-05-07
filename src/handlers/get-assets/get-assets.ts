import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import {
  apiLambdaWrapper,
  apiResponse,
  logger,
  stackEnvVariables
} from '../../helpers';
import { GetAssetsEventBody } from '../../interfaces';
import { s3Service } from '../../services';
import { getAssetBodySchema } from './schema/event-body';

const getAssets = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { key } =
    (event.body && (JSON.parse(event.body) as GetAssetsEventBody)) || {};

  try {
    logger.info({
      message: 'Getting assets.',
      params: { key }
    });

    const dirs = await s3Service
      .listObjects({
        Bucket: stackEnvVariables.BUCKET_NAME,
        Prefix: key,
        MaxKeys: 1000,
        Delimiter: '/'
      })
      .promise();

    if (!dirs.Contents || !dirs.CommonPrefixes?.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          files: [],
          folders: [],
          currentKey: key
        })
      };
    }
    const files = dirs.Contents.map((dir) => {
      const folderName = dir.Key?.replace(key || '', '');

      return {
        folderName,
        size: dir.Size
      };
    });

    const folders = dirs.CommonPrefixes.map((dir) => {
      const folderName = dir.Prefix?.replace(key || '', '');

      return folderName;
    });

    return apiResponse(200, {
      files,
      totalFiles: files.length,
      folders,
      totalFolders: folders.length,
      currentFolder: key
    });
  } catch (error) {
    logger.error({
      message: 'Error getting assets.',
      error
    });

    return apiResponse(500, {
      message: 'Internal server error.'
    });
  }
};

export const handler = apiLambdaWrapper(getAssets, {
  handlerName: 'get-assets',
  validationSchema: getAssetBodySchema
});
