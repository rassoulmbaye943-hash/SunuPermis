'use strict';

const { Pool } = require('pg');
const { createId, mergeProgressObjects } = require('./repository');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    objective: row.objective || '',
    role: row.role || 'user',
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at).toISOString()
  };
}

function mapAdmin(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: 'admin',
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at).toISOString()
  };
}

class PostgresRepository {
  constructor(connectionString) {
    if (!connectionString) throw new Error('DATABASE_URL est requis pour le repository Postgres.');
    this.pool = new Pool({
      connectionString,
      max: process.env.VERCEL ? 1 : 4,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      keepAlive: true
    });
    this.pool.on('error', (error) => console.error('Erreur de pool Postgres :', error.message));
    this.ready = this.pool.query(
      `SELECT to_regclass('public.sp_users') IS NOT NULL AS users,
              to_regclass('public.sp_admins') IS NOT NULL AS admins,
              to_regclass('public.sp_progress') IS NOT NULL AS progress,
              to_regclass('public.sp_questions') IS NOT NULL AS questions,
              to_regclass('public.sp_inscriptions') IS NOT NULL AS inscriptions,
              to_regclass('public.sp_messages') IS NOT NULL AS messages`
    ).then(({ rows }) => {
      if (!rows[0] || Object.values(rows[0]).some((exists) => !exists)) {
        throw new Error('Schéma Postgres absent ou incomplet. Exécute npm run db:migrate avant de démarrer l’API.');
      }
      return this;
    });
  }

  createId() { return createId(); }

  async findUserByEmail(email) {
    if (!email) return undefined;
    const result = await this.pool.query('SELECT * FROM sp_users WHERE email = lower($1) LIMIT 1', [String(email).trim()]);
    return mapUser(result.rows[0]) || undefined;
  }

  async findUserById(id) {
    const result = await this.pool.query('SELECT * FROM sp_users WHERE id = $1 LIMIT 1', [id]);
    return mapUser(result.rows[0]) || undefined;
  }

  async listUsers() {
    const result = await this.pool.query('SELECT * FROM sp_users ORDER BY created_at DESC');
    return result.rows.map(mapUser);
  }

  async addUser(user) {
    const result = await this.pool.query(
      `INSERT INTO sp_users (id, name, email, objective, role, password_hash, created_at)
       VALUES ($1, $2, lower($3), $4, $5, $6, $7) RETURNING *`,
      [user.id || createId(), user.name, user.email, user.objective || '', user.role || 'user', user.passwordHash, user.createdAt || new Date().toISOString()]
    );
    return mapUser(result.rows[0]);
  }

  async updateUser(id, changes) {
    const current = await this.findUserById(id);
    if (!current) return null;
    const updated = Object.assign({}, current, changes);
    const result = await this.pool.query(
      `UPDATE sp_users SET name = $2, email = lower($3), objective = $4, role = $5,
       password_hash = $6 WHERE id = $1 RETURNING *`,
      [id, updated.name, updated.email, updated.objective || '', updated.role || 'user', updated.passwordHash]
    );
    return mapUser(result.rows[0]);
  }

  async removeUser(id) {
    const result = await this.pool.query('DELETE FROM sp_users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async findAdminByEmail(email) {
    if (!email) return undefined;
    const result = await this.pool.query('SELECT * FROM sp_admins WHERE email = lower($1) LIMIT 1', [String(email).trim()]);
    return mapAdmin(result.rows[0]) || undefined;
  }

  async findAdminById(id) {
    const result = await this.pool.query('SELECT * FROM sp_admins WHERE id = $1 LIMIT 1', [id]);
    return mapAdmin(result.rows[0]) || undefined;
  }

  async addAdmin(admin) {
    const result = await this.pool.query(
      `INSERT INTO sp_admins (id, name, email, password_hash, created_at)
       VALUES ($1, $2, lower($3), $4, $5) RETURNING *`,
      [admin.id || createId(), admin.name || 'Administrateur', admin.email, admin.passwordHash, admin.createdAt || new Date().toISOString()]
    );
    return mapAdmin(result.rows[0]);
  }

  async getProgress(userId) {
    const result = await this.pool.query('SELECT payload FROM sp_progress WHERE user_id = $1', [userId]);
    return result.rows[0] ? result.rows[0].payload : undefined;
  }

  async setProgress(userId, progress) {
    const result = await this.pool.query(
      `INSERT INTO sp_progress (user_id, payload, updated_at) VALUES ($1, $2::jsonb, now())
       ON CONFLICT (user_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()
       RETURNING payload`,
      [userId, JSON.stringify(progress || {})]
    );
    return result.rows[0].payload;
  }

  async mergeProgress(userId, incoming) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO sp_progress (user_id, payload) VALUES ($1, '{}'::jsonb)
         ON CONFLICT (user_id) DO NOTHING`, [userId]
      );
      const current = await client.query('SELECT payload FROM sp_progress WHERE user_id = $1 FOR UPDATE', [userId]);
      const merged = mergeProgressObjects(current.rows[0]?.payload || {}, incoming);
      await client.query('UPDATE sp_progress SET payload = $2::jsonb, updated_at = now() WHERE user_id = $1', [userId, JSON.stringify(merged)]);
      await client.query('COMMIT');
      return merged;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteProgress(userId) {
    await this.pool.query('DELETE FROM sp_progress WHERE user_id = $1', [userId]);
  }

  async listQuestions() {
    const result = await this.pool.query('SELECT payload FROM sp_questions ORDER BY created_at DESC');
    return result.rows.map((row) => row.payload);
  }

  async addQuestion(question) {
    await this.pool.query(
      'INSERT INTO sp_questions (id, payload, created_at) VALUES ($1, $2::jsonb, $3)',
      [question.id, JSON.stringify(question), question.createdAt || new Date().toISOString()]
    );
    return question;
  }

  async removeQuestion(id) {
    const result = await this.pool.query('DELETE FROM sp_questions WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async addInscription(inscription) {
    await this.pool.query(
      'INSERT INTO sp_inscriptions (id, status, date_inscription, payload) VALUES ($1, $2, $3, $4::jsonb)',
      [inscription.id, inscription.statut || 'en attente', inscription.dateInscription || new Date().toISOString(), JSON.stringify(inscription)]
    );
    return inscription;
  }

  async listInscriptions(status) {
    const result = await this.pool.query(
      `SELECT payload FROM sp_inscriptions WHERE ($1::text IS NULL OR status = $1)
       ORDER BY date_inscription DESC`, [status || null]
    );
    return result.rows.map((row) => row.payload);
  }

  async updateInscription(id, changes) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const found = await client.query('SELECT payload FROM sp_inscriptions WHERE id = $1 FOR UPDATE', [id]);
      if (!found.rows[0]) {
        await client.query('COMMIT');
        return null;
      }
      const updated = Object.assign({}, found.rows[0].payload, changes);
      const result = await client.query(
        `UPDATE sp_inscriptions SET status = $2, payload = $3::jsonb WHERE id = $1 RETURNING payload`,
        [id, updated.statut || 'en attente', JSON.stringify(updated)]
      );
      await client.query('COMMIT');
      return result.rows[0]?.payload || null;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async addMessage(message) {
    await this.pool.query(
      'INSERT INTO sp_messages (id, date_envoi, payload) VALUES ($1, $2, $3::jsonb)',
      [message.id, message.dateEnvoi || new Date().toISOString(), JSON.stringify(message)]
    );
    return message;
  }

  async listMessages() {
    const result = await this.pool.query('SELECT payload FROM sp_messages ORDER BY date_envoi DESC');
    return result.rows.map((row) => row.payload);
  }

  async getCounts() {
    const result = await this.pool.query(
      `SELECT (SELECT count(*) FROM sp_users)::int AS users,
              (SELECT count(*) FROM sp_questions)::int AS questions`
    );
    return result.rows[0];
  }

  async getAdminStats() {
    const result = await this.pool.query(
      `SELECT
        (SELECT count(*) FROM sp_users)::int AS users,
        (SELECT count(*) FROM (
          SELECT email FROM sp_users WHERE role = 'admin'
          UNION SELECT email FROM sp_admins
        ) AS admin_accounts)::int AS admins,
        (SELECT count(*) FROM sp_questions)::int AS custom_questions,
        (SELECT count(*) FROM sp_inscriptions)::int AS inscriptions,
        (SELECT count(*) FROM sp_messages)::int AS messages,
        COALESCE((SELECT sum(jsonb_array_length(CASE WHEN jsonb_typeof(payload->'quizScores') = 'array' THEN payload->'quizScores' ELSE '[]'::jsonb END)) FROM sp_progress), 0)::int AS quizzes_taken,
        COALESCE((SELECT sum(jsonb_array_length(CASE WHEN jsonb_typeof(payload->'examResults') = 'array' THEN payload->'examResults' ELSE '[]'::jsonb END)) FROM sp_progress), 0)::int AS exams_taken`
    );
    return result.rows[0];
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = { PostgresRepository };
