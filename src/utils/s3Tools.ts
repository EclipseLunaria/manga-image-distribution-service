import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {fromEnv} from "@aws-sdk/credential-provider-env";
dotenv.config();
const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv() });

export const uploadFileToS3 = async (key: string, body: any) => {
    try {        
        await s3Client.send(new PutObjectCommand({
            Bucket: "manga-reader-chapters",
            Key: key,
            Body: body,
        }));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}