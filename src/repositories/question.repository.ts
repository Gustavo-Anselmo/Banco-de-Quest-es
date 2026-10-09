import { db } from "../config/database";

export interface QuestionRow {
  id: string;
  subject_id: string;
  type: string;
  text: string;
  options_json: string | null;
  correct_index: number | null;
  expected_answer: string | null;
  created_at: string;
  updated_at: string;
}

export const questionRepository = {
  findAll(subjectId?: string): QuestionRow[] {
    if (subjectId) {
      return db
        .prepare("SELECT * FROM questions WHERE subject_id = ? ORDER BY created_at ASC")
        .all(subjectId) as unknown as QuestionRow[];
    }
    return db.prepare("SELECT * FROM questions ORDER BY created_at ASC").all() as unknown as QuestionRow[];
  },

  findById(id: string): QuestionRow | undefined {
    return db.prepare("SELECT * FROM questions WHERE id = ?").get(id) as QuestionRow | undefined;
  },

  findTextsBySubject(subjectId: string): string[] {
    const rows = db
      .prepare("SELECT text FROM questions WHERE subject_id = ?")
      .all(subjectId) as unknown as { text: string }[];
    return rows.map((r) => r.text);
  },

  insert(row: QuestionRow): void {
    db.prepare(
      `INSERT INTO questions
        (id, subject_id, type, text, options_json, correct_index, expected_answer, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      row.id,
      row.subject_id,
      row.type,
      row.text,
      row.options_json,
      row.correct_index,
      row.expected_answer,
      row.created_at,
      row.updated_at
    );
  },

  update(id: string, fields: Omit<QuestionRow, "id" | "created_at">): void {
    db.prepare(
      `UPDATE questions SET
        subject_id = ?,
        type = ?,
        text = ?,
        options_json = ?,
        correct_index = ?,
        expected_answer = ?,
        updated_at = ?
       WHERE id = ?`
    ).run(
      fields.subject_id,
      fields.type,
      fields.text,
      fields.options_json,
      fields.correct_index,
      fields.expected_answer,
      fields.updated_at,
      id
    );
  },

  remove(id: string): void {
    db.prepare("DELETE FROM questions WHERE id = ?").run(id);
  },
};
