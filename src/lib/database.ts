const { Pool } = require("pg");

let pool: any = null;

export function getPool(): any {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

export async function initDatabase(): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  const sql = [
    `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, phone_email TEXT UNIQUE, nickname TEXT, password_hash TEXT, role_type TEXT DEFAULT 'user', membership_level TEXT DEFAULT 'free', points_balance INTEGER DEFAULT 10, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())`,
    `CREATE TABLE IF NOT EXISTS model_configs (provider TEXT PRIMARY KEY, model_name TEXT, api_key TEXT DEFAULT '', api_url TEXT, is_active BOOLEAN DEFAULT true, mode_mapping TEXT[] DEFAULT '{}', system_prompt TEXT DEFAULT '', temperature REAL DEFAULT 0.7)`,
    `CREATE TABLE IF NOT EXISTS site_content (key TEXT PRIMARY KEY, value TEXT DEFAULT '')`,
    `CREATE TABLE IF NOT EXISTS generations (id TEXT PRIMARY KEY, user_id TEXT, task_type TEXT, event_type TEXT, generation_mode TEXT, model_provider TEXT, model_name TEXT, risk_level TEXT DEFAULT 'low', points_used INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW())`,
  ];
  for (const s of sql) { try { await getPool().query(s); } catch (e) { console.error("DB init:", e); } }
}

export async function syncUsers(users: any[]): Promise<void> {
  if (!process.env.DATABASE_URL || users.length === 0) return;
  for (const u of users) {
    try {
      await getPool().query(
        "INSERT INTO users (id, phone_email, nickname, password_hash, role_type, membership_level, points_balance) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET phone_email=$2, nickname=$3, password_hash=$4, role_type=$5, membership_level=$6, points_balance=$7",
        [u.id, u.phone_email, u.nickname, u.password_hash, u.role_type, u.membership_level, u.points_balance]
      );
    } catch {}
  }
}