import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  ACCESS_KEY_ID,
  APPLICATION_NAME,
  BUCKET_NAME,
  REGION,
  SECRET_ACCESS_KEY,
} from "../../config/config";
import { nanoid } from "nanoid";
import { badRequestException } from "../error.handle";

class S3Service {
  private S3Client: S3Client;

  private kay(path: string, name: string) {
    return `${APPLICATION_NAME}/${nanoid(10)}-${path}/${name}`
  }

  constructor() {
    this.S3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile({
    Bucket = BUCKET_NAME,
    Path = "public",
    file,
    ACL = ObjectCannedACL.private
  }:{
    Bucket?: string;
    Path?: string;
    file : Express.Multer.File
    ACL ?: ObjectCannedACL
  }) {
    const command = new PutObjectCommand({
      Bucket,
      Key: this.kay(Path,file.originalname),
      Body: file.buffer,
      ACL,
      ContentType: file.mimetype,
    });

    await this.S3Client.send(command);
    if (!command.input.Key) {
        throw new badRequestException("file interrupted");
    }
    return command.input.Key;
  }

}


export default new S3Service();