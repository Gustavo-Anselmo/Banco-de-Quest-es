import { subjectRepository, SubjectRow } from "../repositories/subject.repository";
import { generateId } from "../utils/id";
import { CreateSubjectInput, HttpError, SubjectDTO, UpdateSubjectInput } from "../types";

function toDTO(row: SubjectRow): SubjectDTO {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const subjectService = {
  async list(): Promise<SubjectDTO[]> {
    return subjectRepository.findAll().map(toDTO);
  },

  async getRowByIdOrThrow(id: string): Promise<SubjectRow> {
    const row = subjectRepository.findById(id);
    if (!row) throw new HttpError(404, "Matéria não encontrada.");
    return row;
  },

  async getByIdOrThrow(id: string): Promise<SubjectDTO> {
    return toDTO(await this.getRowByIdOrThrow(id));
  },

  async create(input: CreateSubjectInput): Promise<SubjectDTO> {
    const name = input.name?.trim();
    if (!name) throw new HttpError(400, "Dê um nome para a matéria.");
    if (!input.color) throw new HttpError(400, "Escolha uma cor para a matéria.");

    const now = new Date().toISOString();
    const row: SubjectRow = {
      id: generateId(),
      name,
      color: input.color,
      created_at: now,
      updated_at: now,
    };
    subjectRepository.insert(row);
    return toDTO(row);
  },

  async update(id: string, input: UpdateSubjectInput): Promise<SubjectDTO> {
    const current = await this.getRowByIdOrThrow(id);
    if (input.name !== undefined && !input.name.trim()) {
      throw new HttpError(400, "Dê um nome para a matéria.");
    }
    const updated: SubjectRow = {
      ...current,
      name: input.name !== undefined ? input.name.trim() : current.name,
      color: input.color !== undefined ? input.color : current.color,
      updated_at: new Date().toISOString(),
    };
    subjectRepository.update(id, { name: updated.name, color: updated.color, updated_at: updated.updated_at });
    return toDTO(updated);
  },

  async remove(id: string): Promise<void> {
    await this.getRowByIdOrThrow(id);
    subjectRepository.remove(id);
  },
};
