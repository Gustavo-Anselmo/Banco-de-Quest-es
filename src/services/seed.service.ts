import { subjectRepository } from "../repositories/subject.repository";
import { questionRepository } from "../repositories/question.repository";
import { SEED_QUESTION_TEMPLATES, SEED_SUBJECT_COLOR, SEED_SUBJECT_NAME } from "./seedData";
import { QuestionDTO, SubjectDTO } from "../types";
import { subjectService } from "./subject.service";
import { questionService } from "./question.service";

export const seedService = {
  /**
   * Cria (ou reaproveita) a matéria "Sistemas Embarcados" e insere as 27 questões
   * de exemplo, ignorando as que já existirem (por texto do enunciado).
   */
  async seedExamples(): Promise<{ subject: SubjectDTO; created: QuestionDTO[] }> {
    let subjectRow = subjectRepository.findByName(SEED_SUBJECT_NAME);
    if (!subjectRow) {
      const createdSubject = await subjectService.create({
        name: SEED_SUBJECT_NAME,
        color: SEED_SUBJECT_COLOR,
      });
      subjectRow = subjectRepository.findById(createdSubject.id)!;
    }

    const existingTexts = new Set(questionRepository.findTextsBySubject(subjectRow.id));

    const created: QuestionDTO[] = [];
    for (const template of SEED_QUESTION_TEMPLATES) {
      if (existingTexts.has(template.text)) continue;
      const q = await questionService.create({ ...template, subjectId: subjectRow.id });
      created.push(q);
    }

    const subject = await subjectService.getByIdOrThrow(subjectRow.id);
    return { subject, created };
  },
};
