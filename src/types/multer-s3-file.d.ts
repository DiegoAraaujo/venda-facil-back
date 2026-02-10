export interface MulterS3File extends Express.Multer.File {
  location: string;
  key: string;
}