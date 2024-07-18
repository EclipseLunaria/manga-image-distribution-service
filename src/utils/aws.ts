import { HttpRequest } from "@smithy/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand,ListObjectsV2Command } from "@aws-sdk/client-s3";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@smithy/hash-node";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { S3Client,ListObjectsCommand } from "@aws-sdk/client-s3";
import { buildPrefix } from "./helpers";

const checkChapterInS3 = async (prefix: string) => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing required environment variables");
  }
  const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv()});
  console.log(prefix);
        return s3Client.send(new ListObjectsCommand({ Bucket: bucket, Prefix: prefix, MaxKeys: 1 }))
            .then((response) => {
              console.log(response);
                if (response.Contents && response.Contents.length > 0) {
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.log(error);
                if (error.name === "NotFound") {
                    return false;
                }
                throw error;
        });
    };


    const createPresignedUrl = async ({ key }: { key: string }) => {
      const bucket = process.env.BUCKET_NAME;
      const region = process.env.AWS_REGION;
    
      if (!bucket || !region) {
        throw new Error("Missing required environment variables");
      }
      const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
      const presigner = new S3RequestPresigner({
        credentials: fromEnv(),
        region,
        sha256: Hash.bind(null, "sha256"),
      });
    
      const signedUrlObject = await presigner.presign(
        new HttpRequest({ ...url, method: "PUT" }),
      );
      return formatUrl(signedUrlObject);
    };
    
    
    
    // const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv()});
    

    const uploadFileToS3 = async (key: string, body: any) => {
      const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv()});
      try {        
        console.log(key);
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
          Body: body,
        }));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }finally {
      s3Client.destroy();
    }

}

//used to pull existing prefixes from s3
const getChapterPagesFromS3 = async (mangaId: string, chapterId: string) => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing required environment variables");
  }
  
  const prefix = buildPrefix(mangaId, chapterId);

  const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 1000 });
  const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv()});
  
  try{
    const response = await s3Client.send(listObjectsCommand);
    return response.Contents?.map((item) => item.Key) || [];

  }
  catch (e) {
    console.log(e);
    
    return [];
  }finally {
    s3Client.destroy();
  }

};

export { createPresignedUrl, checkChapterInS3, getChapterPagesFromS3 as getChapterPrefixesFromS3, uploadFileToS3 };