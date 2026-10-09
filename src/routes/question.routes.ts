import { Router } from "express";
import { questionController } from "../controllers/question.controller";

export const questionRoutes = Router();

questionRoutes.get("/", questionController.list); // ?subjectId=xxx (opcional)
questionRoutes.post("/", questionController.create);
questionRoutes.put("/:id", questionController.update);
questionRoutes.delete("/:id", questionController.remove);
