import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {fromEnv} from "@aws-sdk/credential-provider-env";
dotenv.config();

const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv() });


export const retrieveChapter = async (mangaId: string, chapterId: string) => {
  
}

export const chapterExistsInS3 = async (mangaId: string, chapterId: string) => {

}