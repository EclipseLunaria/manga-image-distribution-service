import { ElementHandle, Page } from "puppeteer";
import { getBrowser } from "./globalBrowser";
import { uploadFileToS3 } from "./aws";
export const isDev = process.env.NODE_ENV !== "production";

export const screenshotElement = async (
  element: ElementHandle,
  page: Page
): Promise<Buffer | null> => {
  const boundingBox = await element.boundingBox();
  if (!boundingBox || boundingBox.height < 900) {
    return null;
  }

  await page.evaluate((boundingBox) => {
    window.scrollTo(boundingBox.x, boundingBox.y);
  }, boundingBox);
  // remove element with id top from html
  const topElem = await page.$("#top");
  await page.evaluate((topElem) => {
    topElem?.remove();
  }, topElem);

  return await element.screenshot({
    type: "jpeg",
    quality: 70,
  });
};

export const storePage = async (
  mangaId: string,
  chapterId: string,
  pageNumber: number,
  screenshot: Buffer
) => {
  const url = `manga-${mangaId}/chapter-${chapterId}/page-${pageNumber}.jpg`;
  console.log(`Storing page ${pageNumber} to ${url}`);

  await uploadFileToS3(url, screenshot);
};

export const openPage = async (url: string) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};
