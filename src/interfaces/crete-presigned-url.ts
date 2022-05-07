export interface CreatePresignedUrlEventBody {
  key: string;
  fileSize: number;
  directory?: string;
}
