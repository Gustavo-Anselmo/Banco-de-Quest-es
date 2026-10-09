import { questionRepository, QuestionRow } from "../repositories/question.repository";
import { subjectRepository } from "../repositories/subject.repository";
import { generateId } from "../utils/id";
import {
  CreateQuestionInput,
  HttpError,
  QuestionDTO,
  QuestionType,
  UpdateQuestionInput,
} from "../types";

function toDTO(row: QuestionRow): QuestionDTO {
  return {
    id: row.id,
    subjectId: row.subject_id,
    type: row.type as QuestionType,
    text: row.text,
    options: row.options_json ? JSON.parse(row.options_json) : undefined,
    correctIndex: row.correct_index ?? undefined,
    expectedAnswer: row.expected_answer ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function validateClosed(options: string[], correctIndex: number | undefined) {
  const cleaned = options.map((o) => o.trim());
  if (cleaned.length < 2 || cleaned.some((o) => !o)) {
    throw new HttpError(400, "Preencha todas as alternativas (mín. 2) ou remova as vazias.");
  }
  if (correctIndex == null || correctIndex < 0 || correctIndex >= cleaned.length) {
    throw new HttpError(400, "Marque qual alternativa é a correta.");
  }
  return cleaned;
}

export const questionService = {
  async list(subjectId?: string): Promise<QuestionDTO[]> {
    return questionRepository.findAll(subjectId).map(toDTO);
  },

  async getRowByIdOrThrow(id: string): Promise<QuestionRow> {
    const row = questionRepository.findById(id);
    if (!row) throw new HttpError(404, "Questão não encontrada.");
    return row;
  },

  async create(input: CreateQuestionInput): Promise<QuestionDTO> {
    if (!input.subjectId) throw new HttpError(400, "Escolha a matéria desta questão.");
    if (!input.text?.trim()) throw new HttpError(400, "Escreva o enunciado da questão.");
    if (!input.type || !["fechada", "aberta"].includes(input.type)) {
      throw new HttpError(400, "Tipo de questão inválido.");
    }
    const subject = subjectRepository.findById(input.subjectId);
    if (!subject) throw new HttpError(400, "Matéria informada não existe.");

    let optionsJson: string | null = null;
    let correctIndex: number | null = null;
    let expectedAnswer: string | null = null;

    if (input.type === "fechada") {
      const cleaned = validateClosed(input.options || [], input.correctIndex);
      optionsJson = JSON.stringify(cleaned);
      correctIndex = input.correctIndex!;
    } else {
      if (!input.expectedAnswer?.trim()) {
        throw new HttpError(400, "Cadastre a resposta esperada (gabarito).");
      }
      expectedAnswer = input.expectedAnswer.trim();
    }

    const now = new Date().toISOString();
    const row: QuestionRow = {
      id: generateId(),
      subject_id: input.subjectId,
      type: input.type,
      text: input.text.trim(),
      options_json: optionsJson,
      correct_index: correctIndex,
      expected_answer: expectedAnswer,
      created_at: now,
      updated_at: now,
    };
    questionRepository.insert(row);
    return toDTO(row);
  },

  async update(id: string, input: UpdateQuestionInput): Promise<QuestionDTO> {
    const existing = await this.getRowByIdOrThrow(id);
    const type: QuestionType = input.type ?? (existing.type as QuestionType);

    if (input.text !== undefined && !input.text.trim()) {
      throw new HttpError(400, "Escreva o enunciado da questão.");
    }
    if (input.subjectId) {
      const subject = subjectRepository.findById(input.subjectId);
      if (!subject) throw new HttpError(400, "Matéria informada não existe.");
    }

    let optionsJson: string | null = existing.options_json;
    let correctIndex: number | null = existing.correct_index;
    let expectedAnswer: string | null = existing.expected_answer;

    if (type === "fechada") {
      const baseOptions = input.options ?? (existing.options_json ? JSON.parse(existing.options_json) : []);
      const baseCorrect = input.correctIndex ?? existing.correct_index ?? 0;
      const cleaned = validateClosed(baseOptions, baseCorrect);
      optionsJson = JSON.stringify(cleaned);
      correctIndex = baseCorrect;
      expectedAnswer = null;
    } else {
      const answer = input.expectedAnswer ?? existing.expected_answer ?? "";
      if (!answer.trim()) throw new HttpError(400, "Cadastre a resposta esperada (gabarito).");
      expectedAnswer = answer.trim();
      optionsJson = null;
      correctIndex = null;
    }

    const updatedRow: QuestionRow = {
      ...existing,
      subject_id: input.subjectId ?? existing.subject_id,
      type,
      text: input.text !== undefined ? input.text.trim() : existing.text,
      options_json: optionsJson,
      correct_index: correctIndex,
      expected_answer: expectedAnswer,
      updated_at: new Date().toISOString(),
    };

    questionRepository.update(id, {
      subject_id: updatedRow.subject_id,
      type: updatedRow.type,
      text: updatedRow.text,
      options_json: updatedRow.options_json,
      correct_index: updatedRow.correct_index,
      expected_answer: updatedRow.expected_answer,
      updated_at: updatedRow.updated_at,
    });

    return toDTO(updatedRow);
  },

  async remove(id: string): Promise<void> {
    await this.getRowByIdOrThrow(id);
    questionRepository.remove(id);
  },
};
