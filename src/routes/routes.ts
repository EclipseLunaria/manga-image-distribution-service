import { Router } from "express";
import { getChapterContent, checkChapterExists } from "../controllers";
import { extractChapter } from "../controllers";
const router = Router();

router.get("/fetch/manga-:mangaId/chapter-:chapterId", getChapterContent);

router.get("/exists/manga-:mangaId/chapter-:chapterId", checkChapterExists);

router.get("/extract/manga-:mangaId/chapter-:chapterId", extractChapter);


export default router;
