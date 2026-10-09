import { Router } from "express";
import { subjectController } from "../controllers/subject.controller";

export const subjectRoutes = Router();

subjectRoutes.get("/", subjectController.list);
subjectRoutes.post("/", subjectController.create);
subjectRoutes.put("/:id", subjectController.update);
subjectRoutes.delete("/:id", subjectController.remove);
