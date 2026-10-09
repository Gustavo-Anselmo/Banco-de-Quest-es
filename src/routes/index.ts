import { Router } from "express";
import { subjectRoutes } from "./subject.routes";
import { questionRoutes } from "./question.routes";
import { examController, seedController } from "../controllers/exam.controller";

export const router = Router();

router.use("/subjects", subjectRoutes);
router.use("/questions", questionRoutes);
router.post("/exam/generate", examController.generate);
router.post("/seed", seedController.run);

router.get("/health", (_req, res) => res.json({ ok: true }));
