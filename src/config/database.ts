import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

// Caminho do arquivo .sqlite. Pode ser sobrescrito pela variável de ambiente
// DATABASE_PATH, por exemplo para apontar para um disco persistente em produção.
const DEFAULT_DB_PATH = path.join(__dirname, "..", "..", "database", "data.sqlite");
const DB_PATH = process.env.DATABASE_PATH || DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// node:sqlite é nativo do Node.js (a partir da v22.5) — não exige nenhuma
// compilação de módulo nativo (diferente de libs como better-sqlite3/sqlite3),
// então funciona igual em Windows, Linux e macOS sem instalar Visual Studio,
// Xcode ou build tools.
export const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Aplica as migrations (arquivos .sql) presentes em database/migrations, em ordem.
function runMigrations() {
  const migrationsDir = path.join(__dirname, "..", "..", "database", "migrations");
  if (!fs.existsSync(migrationsDir)) return;

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    db.exec(sql);
  }
}

runMigrations();
