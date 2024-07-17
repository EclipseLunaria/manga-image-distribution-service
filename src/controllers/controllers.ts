import { Request, Response } from "express";
import { retrieveChapter, chapterExistsInS3 } from "../services";

export const getChapterContent = async (req: Request, res: Response) => {
  const { mangaId, chapterId } = req.params;
  try {
    const urls = await retrieveChapter(mangaId, chapterId);
    console.log(urls);
    res.send(urls);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while extracting the chapter");
  }
};

export const checkChapterExists = async (req: Request, res: Response) => {
  const { mangaId, chapterId } = req.params;
  try {
    const exists = await chapterExistsInS3(mangaId, chapterId);
    res.send(exists);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while checking the chapter");
  }
}
