import { HttpRequest } from "@smithy/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@smithy/hash-node";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { S3Client,ListObjectsCommand } from "@aws-sdk/client-s3";

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


const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv()});

const checkChapterInS3 = async (prefix: string) => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing required environment variables");
  }
        return s3Client.send(new ListObjectsCommand({ Bucket: bucket, Prefix: prefix, MaxKeys: 1 }))
            .then(() => true)
            .catch((error) => {
                console.log(error);
                if (error.name === "NotFound") {
                    return false;
                }
                throw error;
        });
    };



export const uploadFileToS3 = async (key: string, body: any) => {
    try {        
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: body,
        }));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export { createPresignedUrl, checkChapterInS3 };