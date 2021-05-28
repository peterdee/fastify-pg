import { promises as fs } from 'fs';

import connection from './index.js';
import log from '../utilities/log.js';

/**
 * Delete migration file and its record if it was not applied
 */
(async function deleteMigration() {
  const fileName = process.argv[2];
  if (!fileName) {
    throw new Error('Please provide the file name!');
  }

  const [migrationId = ''] = fileName.split('-').slice(-1);
  if (!migrationId) {
    throw new Error('Invalid file name!');
  }

  const { rows: [result = null] = [] } = await connection.query(
    'SELECT * FROM "Migrations" WHERE "migrationId" = $1;',
    [migrationId],
  );
  if (result && result.applied) {
    throw new Error('Migration is already applied!');
  }

  if (!result) {
    throw new Error('Migration record not found!');
  }

  const migrationPath = `${process.cwd()}/migrations/${fileName}.js`;

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
