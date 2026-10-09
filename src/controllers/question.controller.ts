import { Request, Response, NextFunction } from "express";
import { questionService } from "../services/question.service";

export const questionController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
      res.json(await questionService.list(subjectId));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await questionService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await questionService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await questionService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
