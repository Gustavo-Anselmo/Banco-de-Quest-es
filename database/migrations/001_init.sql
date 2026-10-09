CREATE TABLE IF NOT EXISTS subjects (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id              TEXT PRIMARY KEY,
  subject_id      TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('fechada', 'aberta')),
  text            TEXT NOT NULL,
  options_json    TEXT,
  correct_index   INTEGER,
  expected_answer TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions (subject_id);
