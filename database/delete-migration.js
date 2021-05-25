import { promises as fs } from 'fs';

import connection from './index.js';
import log from '../utilities/log.js';

/**
 * Delete migration file and its record if it was not applied
 */
(async function deleteMigration() {
  const migrationId = process.argv[2];
  if (!migrationId) {
    throw new Error('Please provide Migration ID!');
  }

  const { rows: [result = null] = [] } = await connection.query(
    'SELECT * FROM "Migrations" WHERE "migrationId" = $1;',
    [migrationId],
  );
  if (result && result.applied) {
    throw new Error('Migration is already applied!');
  }

  if (!result) {
    throw new Error('Migration ID not found!');
  }

  const migrationPath = `${process.cwd()}/migrations/${migrationId}.js`;

  try {
    await fs.unlink(migrationPath);
  } catch (error) {
    const { message = '' } = error;
    if (message && message.includes('ENOENT')) {
      log('-- migrations: migration file not found');
    }
  }

  await connection.query(
    'DELETE FROM "Migrations" WHERE "migrationId" = $1;',
    [migrationId],
  );

  log(`-- migrations: migration ${migrationId} deleted`);

  await connection.end();
  return process.exit(0);
}());
