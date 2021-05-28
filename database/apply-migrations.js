import { promises as fs } from 'fs';

import connection from './index.js';
import log from '../utilities/log.js';

async function applyChanges(migrationsPath = '', migrationFiles = []) {
  // eslint-disable-next-line
  for await (let record of migrationFiles) {
    try {
      const fileName = `${record.fileName}.js`;

      const { default: file } = await import(`../migrations/${fileName}`);
      await connection.query(file);
      await connection.query(
        'UPDATE "Migrations" SET applied = TRUE WHERE id = $1',
        [record.id],
      );
      log(`-- migrations: applied migration ${record.fileName}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

/**
 * Delete migrations
 * @returns {Promise<void>}
 */
async function deleteMigrations() {
  return connection.query('DELETE FROM "Migrations";');
}

/**
 * Apply existing migrations
 * @returns {Promise<void | Error>}
 */
export default async function applyMigrations() {
  const migrationsPath = `${process.cwd()}/migrations`;
  try {
    await fs.access(migrationsPath);
  } catch (error) {
    const { message = '' } = error;
    if (message && message.includes('ENOENT')) {
      await deleteMigrations();
      return log('-- migrations: migration files not found');
    }
  }

  const filesList = await fs.readdir(migrationsPath);
  if (!(Array.isArray(filesList) && filesList.length > 0)) {
    await deleteMigrations();
    return log('-- migrations: migration files not found');
  }

  const { rows: migrationRecords } = await connection.query(
    'SELECT * FROM "Migrations" ORDER BY id;',
  );

  // migration records don't exist, apply migration files
  // if (!(Array.isArray(migrationRecords) && migrationRecords.length > 0)) {
  // }

  const allApplied = migrationRecords.every(({ applied }) => applied);
  if (allApplied) {
    return log('-- migrations: all migrations are applied');
  }

  const reversedRecords = migrationRecords.reverse();
  if (reversedRecords[0].applied) {
    return log('-- migrations: all migrations are applied');
  }

  const nonApplied = [];
  for (let i = 0; i < reversedRecords.length; i += 1) {
    if (!reversedRecords[i].applied) {
      nonApplied.push(reversedRecords[i]);
    } else {
      break;
    }
  }

  // eslint-disable-next-line
  for await (let record of nonApplied) {
    try {
      const fileName = `${record.migrationId}.js`;
      await fs.access(`${migrationsPath}/${fileName}`);

      const { default: file } = await import(`../migrations/${fileName}`);
      await connection.query(file);
      await connection.query(
        'UPDATE "Migrations" SET applied = TRUE WHERE id = $1',
        [record.id],
      );
      log(`-- migrations: applied migration ${record.migrationId}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  return log('-- migrations: done');
}
