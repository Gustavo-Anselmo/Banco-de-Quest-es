import { Request, Response, NextFunction } from "express";
import { examService } from "../services/exam.service";
import { seedService } from "../services/seed.service";

export const examController = {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId, typeFilter, count } = req.body;
      const questions = await examService.generate({
        subjectId,
        typeFilter,
        count: Number(count),
      });
      res.json(questions);
    } catch (err) {
      next(err);
    }
  },
};

export const seedController = {
  async run(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await seedService.seedExamples();
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
};
