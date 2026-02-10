import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";

export async function deleteFileFromS3(key: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );
    console.log(`file ${key} deleted from s3`);
  } catch (err) {
    console.error(`Error deleting file ${key} deleted from s3`);
  }
}
