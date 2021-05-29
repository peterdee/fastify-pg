import { promises as fs } from 'fs';

import connection from './index.js';
import log from '../utilities/log.js';

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
  // check migrations directory
  const migrationsPath = `${process.cwd()}/migrations`;
  try {
    await fs.access(migrationsPath);
  } catch (error) {
    const { message = '' } = error;
    if (message && message.includes('ENOENT')) {
      await deleteMigrations();
      log('-- migrations: migration files not found');
      return process.exit(0);
    }
  }

  // check files in the migrations directory
  const filesList = await fs.readdir(migrationsPath);
  if (!(Array.isArray(filesList) && filesList.length > 0)) {
    await deleteMigrations();
    log('-- migrations: migration files not found');
    return process.exit(0);
  }

  // get database records
  const { rows: migrationRecords } = await connection.query(
    'SELECT * FROM "Migrations" ORDER BY id;',
  );

  // migration records don't exist, apply migration files
  if (!(Array.isArray(migrationRecords) && migrationRecords.length > 0)) {
    // eslint-disable-next-line
    for await (let file of filesList) {
      try {
        const { default: migration } = await import(`../migrations/${file}`);
        const [fileName] = file.split('.');
        const [migrationId] = fileName.split('-').slice(-1);
        if (!migrationId) {
          throw new Error(`Invalid file name [${file}]!`);
        }
        await connection.query(migration);
        await connection.query(
          `
            INSERT INTO "Migrations" (applied, "migrationId") VALUES (
              $1,
              $2
            );
          `,
          [
            true,
            migrationId,
          ],
        );
        log(`-- migrations: applied migration ${fileName}`);
      } catch (error) {
        throw new Error(error);
      }

      log('-- migrations: done');
      return process.exit(0);
    }
  }

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
