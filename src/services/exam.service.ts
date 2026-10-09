import { subjectRepository } from "../repositories/subject.repository";
import { GenerateExamInput, HttpError, QuestionDTO } from "../types";
import { questionService } from "./question.service";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const examService = {
  async generate(input: GenerateExamInput): Promise<QuestionDTO[]> {
    if (!input.count || input.count < 1) {
      throw new HttpError(400, "Informe quantas questões deseja na prova.");
    }

    const subjectId = input.subjectId && input.subjectId !== "all" ? input.subjectId : undefined;
    if (subjectId) {
      const subject = subjectRepository.findById(subjectId);
      if (!subject) throw new HttpError(404, "Matéria não encontrada.");
    }

    const all = await questionService.list(subjectId);
    const typeFilter = input.typeFilter ?? "todas";
    const pool = all.filter((q) => {
      if (typeFilter === "fechadas") return q.type === "fechada";
      if (typeFilter === "abertas") return q.type === "aberta";
      return true;
    });

    if (pool.length === 0) {
      throw new HttpError(400, "Não há questões suficientes nesse filtro.");
    }

    return shuffle(pool).slice(0, Math.min(input.count, pool.length));
  },
};
