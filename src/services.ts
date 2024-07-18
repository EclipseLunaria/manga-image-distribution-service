import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import {fromEnv} from "@aws-sdk/credential-provider-env";
import { checkChapterInS3, getChapterPrefixesFromS3 } from "./utils/aws";
import { buildPrefix } from "./utils/helpers";
import { openPage } from "./utils/driverTools";

dotenv.config();

const s3Client = new S3Client({ region: "us-west-2", credentials: fromEnv() });


export const retrieveChapter = async (mangaId: string, chapterId: string) => {
  // check if chapter exists in S3
  const exists = await chapterExists(mangaId, chapterId);
  console.log(exists);

  if (!exists) {
    // extract chapter from site
    console.log("Extracting chapter from site");
    return await extractChapterFromSite(mangaId, chapterId);
  }

  const keys = await getChapterPrefixesFromS3(mangaId, chapterId)

  // const keys = exists ? await getChapterPrefixesFromS3(mangaId, chapterId) : await extractChapterFromSite(mangaId, chapterId);
  
  
  console.log(keys);
  return keys;

  
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

// export const extractChapterFromSite = async (mangaId: string, chapterId: string) => {
//   // open the chapter page
//   openPage(`https://chapmanganato.to/${buildPrefix(mangaId, chapterId)}`);
//   // extract the chapter
//   // store the chapter
// }

import { screenshotElement } from "./utils/driverTools";
import { uploadFileToS3 } from "./utils/aws";

export const extractChapterFromSite = async (mangaId: string, chapterId: string) => {
  const page = await openPage(`https://chapmanganato.to/manga-${mangaId}/chapter-${chapterId}`);
    
  let index = 0;
  const urls: string[] = [];  
    for (const element of (await page.$$(".container-chapter-reader img"))){
      console.log(`Extracting page ${index}`);

      const screenshot = await screenshotElement(element, page);
      console.log(screenshot);
      if (screenshot) {
        await uploadFileToS3(`manga-${mangaId}/chapter-${chapterId}/page-${index}.jpg`, screenshot);
      }
      
      urls.push(`manga-${mangaId}/chapter-${chapterId}/page-${index}.jpg`);
      index++;
    }
    console.log("found urls:", urls);
    page.close();
    
    
    return urls;
    
  };
  // const chapterUrlsPromises = (await page.$$(".container-chapter-reader img"))
  //   .map(async (element, index) => {


  //     console.log(`Extracting page ${index}`);
  //       const screenshot = await screenshotElement(element, page);
  //       if (screenshot) {
  //         await uploadFileToS3(`manga-${mangaId}/chapter-${chapterId}/page-${index}.jpg`, screenshot);
  //       }
  //       return `manga-${mangaId}/chapter-${chapterId}/page-${index}`;
  // });
  // const urls = await Promise.all(chapterUrlsPromises);