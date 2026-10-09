export type QuestionType = "fechada" | "aberta";

export interface SubjectDTO {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDTO {
  id: string;
  subjectId: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctIndex?: number;
  expectedAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectInput {
  name: string;
  color: string;
}

export interface UpdateSubjectInput {
  name?: string;
  color?: string;
}

export interface CreateQuestionInput {
  subjectId: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctIndex?: number;
  expectedAnswer?: string;
}

export interface UpdateQuestionInput {
  subjectId?: string;
  type?: QuestionType;
  text?: string;
  options?: string[];
  correctIndex?: number;
  expectedAnswer?: string;
}

export interface GenerateExamInput {
  subjectId?: string; // ausente ou "all" = todas as matérias
  typeFilter?: "todas" | "fechadas" | "abertas";
  count: number;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
