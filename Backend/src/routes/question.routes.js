import express from "express";
import { getquestions, getQuestionById, getQuestionBySubject, getChaptersBySubject, getQuestionsByChapter } from "../controllers/question.controller.js";

const router = express.Router()

router.get('/', getquestions)

router.get('/subject/:subject', getQuestionBySubject)

router.get('/subject/:subject/chapters', getChaptersBySubject)

router.get('/subject/:subject/chapter/:chapter', getQuestionsByChapter)

router.get('/:id', getQuestionById)

export default router