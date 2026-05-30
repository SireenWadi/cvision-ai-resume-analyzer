// lib/db.ts
// Uses Node.js 22 built-in SQLite (no external binaries needed)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: new (path: string) => NodeSQLiteDB }

interface NodeSQLiteDB {
  exec(sql: string): void
  prepare(sql: string): { run: (...args: any[]) => any; get: (...args: any[]) => any; all: (...args: any[]) => any[] }
}
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'cvision.db')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let _db: NodeSQLiteDB | null = null

export function getDb(): NodeSQLiteDB {
  if (_db) return _db
  _db = new DatabaseSync(DB_PATH)
  initSchema(_db)
  return _db
}

function initSchema(db: NodeSQLiteDB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      extracted_text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analysis_results (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      ats_score INTEGER NOT NULL,
      grammar_score INTEGER NOT NULL,
      keyword_score INTEGER NOT NULL,
      overall_score INTEGER NOT NULL,
      missing_skills TEXT NOT NULL,
      present_skills TEXT NOT NULL,
      suggestions TEXT NOT NULL,
      word_count INTEGER NOT NULL,
      section_count INTEGER NOT NULL,
      job_description TEXT,
      match_score INTEGER,
      missing_keywords TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    );
  `)
}

// ── Helper to generate CUID-like IDs ──────────────────────────────────────────
export function cuid(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
  return `c${timestamp}${random}`
}

// ── User operations ────────────────────────────────────────────────────────────
export function createUser(data: { name: string; email: string; password: string }) {
  const db = getDb()
  const id = cuid()
  db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)').run(id, data.name, data.email, data.password)
  return findUserById(id)!
}

export function findUserByEmail(email: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
}

export function findUserById(id: string) {
  const db = getDb()
  return db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(id) as any
}

export function findUserWithPassword(email: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
}

// ── Resume operations ──────────────────────────────────────────────────────────
export function createResume(data: { userId: string; fileName: string; fileSize: number; fileType: string; extractedText: string }) {
  const db = getDb()
  const id = cuid()
  db.prepare('INSERT INTO resumes (id, user_id, file_name, file_size, file_type, extracted_text) VALUES (?, ?, ?, ?, ?, ?)').run(id, data.userId, data.fileName, data.fileSize, data.fileType, data.extractedText)
  return db.prepare('SELECT * FROM resumes WHERE id = ?').get(id) as any
}

export function findResumeById(id: string, userId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(id, userId) as any
}

export function findResumesByUser(userId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC').all(userId) as any[]
}

// ── Analysis operations ────────────────────────────────────────────────────────
export function createAnalysis(data: {
  resumeId: string
  atsScore: number
  grammarScore: number
  keywordScore: number
  overallScore: number
  missingSkills: string
  presentSkills: string
  suggestions: string
  wordCount: number
  sectionCount: number
}) {
  const db = getDb()
  const id = cuid()
  db.prepare(`
    INSERT INTO analysis_results 
    (id, resume_id, ats_score, grammar_score, keyword_score, overall_score, missing_skills, present_skills, suggestions, word_count, section_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.resumeId, data.atsScore, data.grammarScore, data.keywordScore, data.overallScore, data.missingSkills, data.presentSkills, data.suggestions, data.wordCount, data.sectionCount)
  return db.prepare('SELECT * FROM analysis_results WHERE id = ?').get(id) as any
}

export function updateAnalysisJobMatch(id: string, jobDescription: string, matchScore: number, missingKeywords: string) {
  const db = getDb()
  db.prepare('UPDATE analysis_results SET job_description = ?, match_score = ?, missing_keywords = ? WHERE id = ?').run(jobDescription, matchScore, missingKeywords, id)
}

export function findLatestAnalysisByResume(resumeId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM analysis_results WHERE resume_id = ? ORDER BY created_at DESC LIMIT 1').get(resumeId) as any
}

export function getHistoryForUser(userId: string) {
  const db = getDb()
  const resumes = findResumesByUser(userId)
  return resumes.map(r => {
    const analysis = findLatestAnalysisByResume(r.id)
    return {
      id: r.id,
      fileName: r.file_name,
      fileSize: r.file_size,
      fileType: r.file_type,
      createdAt: r.created_at,
      analysis: analysis ? {
        id: analysis.id,
        atsScore: analysis.ats_score,
        grammarScore: analysis.grammar_score,
        keywordScore: analysis.keyword_score,
        overallScore: analysis.overall_score,
        wordCount: analysis.word_count,
        sectionCount: analysis.section_count,
        matchScore: analysis.match_score,
        missingSkills: JSON.parse(analysis.missing_skills),
        presentSkills: JSON.parse(analysis.present_skills),
        suggestions: JSON.parse(analysis.suggestions),
      } : null,
    }
  })
}
