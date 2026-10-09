import { db } from "../config/database";

export interface SubjectRow {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const subjectRepository = {
  findAll(): SubjectRow[] {
    return db.prepare("SELECT * FROM subjects ORDER BY created_at ASC").all() as unknown as SubjectRow[];
  },

  findById(id: string): SubjectRow | undefined {
    return db.prepare("SELECT * FROM subjects WHERE id = ?").get(id) as SubjectRow | undefined;
  },

  findByName(name: string): SubjectRow | undefined {
    return db.prepare("SELECT * FROM subjects WHERE name = ?").get(name) as SubjectRow | undefined;
  },

  insert(row: SubjectRow): void {
    db.prepare(
      "INSERT INTO subjects (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).run(row.id, row.name, row.color, row.created_at, row.updated_at);
  },

  update(id: string, fields: { name: string; color: string; updated_at: string }): void {
    db.prepare("UPDATE subjects SET name = ?, color = ?, updated_at = ? WHERE id = ?").run(
      fields.name,
      fields.color,
      fields.updated_at,
      id
    );
  },

  remove(id: string): void {
    // "PRAGMA foreign_keys = ON" + ON DELETE CASCADE cuidam de apagar as questões relacionadas.
    db.prepare("DELETE FROM subjects WHERE id = ?").run(id);
  },
};
