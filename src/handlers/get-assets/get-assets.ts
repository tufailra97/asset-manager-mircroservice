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
      .listObjectsV2({
        Bucket: stackEnvVariables.BUCKET_NAME,
        Prefix: `${key}/`,
        MaxKeys: 1000,
        Delimiter: '/'
      })
      .promise();

    if (!dirs.Contents || !dirs.CommonPrefixes?.length) {
      return apiResponse(200, {
        files: [],
        folders: [],
        currentKey: key
      });
    }

    const files = dirs.Contents.map((dir) => {
      const name = key !== '/' ? dir.Key?.replace(key || '', '') : dir.Key;

      return {
        name: name,
        size: dir.Size
      };
    });

    const folders = dirs.CommonPrefixes.map((dir) => {
      const name =
        key !== '/' ? dir.Prefix?.replace(key || '', '') : dir.Prefix;

      return name;
    });

    return apiResponse(200, {
      message: 'Assets retrieved.',
      files,
      totalFiles: files.length,
      folders,
      totalFolders: folders.length,
      currentFolder: key
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error({
      message: 'Error getting assets.',
      error: error.message
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
