'use strict';

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL absent. Configure Neon ou le fichier .env local.');

  const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 10000 });
  try {
    const client = await pool.connect();
    try {
      const schema = fs.readFileSync(path.join(__dirname, '..', 'server', 'data', 'schema.sql'), 'utf8');
      await client.query('BEGIN');
      await client.query(schema);
      await client.query('COMMIT');
      console.log('Schéma SunuPermis appliqué avec succès.');
    } catch (error) {
      if (client) await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Échec de la migration Postgres :', error.message);
  process.exitCode = 1;
});
