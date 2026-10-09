import { Request, Response, NextFunction } from "express";
import { subjectService } from "../services/subject.service";

export const subjectController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await subjectService.list());
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await subjectService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await subjectService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await subjectService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
