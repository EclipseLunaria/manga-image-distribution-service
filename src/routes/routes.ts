import { Router } from "express";
import { getChapterContent, checkChapterExists } from "../controllers/controllers";
const router = Router();

router.get("/fetch/manga-:mangaId/chapter-:chapterId", getChapterContent);

router.get("/exists/manga-:mangaId/chapter-:chapterId", checkChapterExists);

export default router;
