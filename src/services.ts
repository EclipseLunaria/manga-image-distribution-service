import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {fromEnv} from "@aws-sdk/credential-provider-env";
import { checkChapterInS3, createPresignedUrl, getChapterPrefixesFromS3, uploadFileToS3 } from "./utils/aws";
import { buildPrefix } from "./utils/helpers";
import { openPage,screenshotElement } from "./utils/driverTools";

dotenv.config();



export const retrieveChapter = async (mangaId: string, chapterId: string) => {
  // check if chapter exists in S3
  const exists = await chapterExists(mangaId, chapterId);
  console.log(exists);

  const s3prefixes = exists ? await getChapterPrefixesFromS3(mangaId, chapterId) 
  : await extractChapterFromSite(mangaId, chapterId);
  const keys = await getChapterPrefixesFromS3(mangaId, chapterId)
    
  return s3prefixes.map((prefix) => `https://manga-reader-chapters.s3.us-west-2.amazonaws.com/${prefix}`);
  

}

export const chapterExists = async (mangaId: string, chapterId: string) => {
  // call checkChapterInS3
  try {
    const exists = await checkChapterInS3(buildPrefix(mangaId, chapterId));
    return exists;
  } catch (err) {
    console.error(err);
    return false;
  }
}



export const extractChapterFromSite = async (mangaId: string, chapterId: string) => {
  const page = await openPage(`https://chapmanganato.to/manga-${mangaId}/chapter-${chapterId}`);

// page.
  let index = 0;
  const urls: string[] = [];  
    for (const element of (await page.$$(".container-chapter-reader img"))){
      console.log(`Extracting page ${index}`);
      const pagePrefix = `manga-${mangaId}/chapter-${chapterId}/page-${index}.jpg`
      const screenshot = await screenshotElement(element, page);
      console.log(screenshot);
      if (screenshot) {
        await uploadFileToS3(pagePrefix, screenshot);
      }
      
      urls.push(pagePrefix);
      index++;
    }
    console.log("found urls:", urls);

    return urls;
    
  };
  