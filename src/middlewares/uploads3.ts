import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3.js";
import path from "path";
import { Request } from "express";

const bucketName = process.env.AWS_BUCKET_NAME!;

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req: Request, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: any, cb: any) {
      const fileName = `${Date.now()}_${file.fieldname}${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
}); 
