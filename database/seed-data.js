import { hash } from 'scryptwrap';

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from '../configuration/index.js';
import connection from './index.js';
import log from '../utilities/log.js';

/**
 * Seed database data
 * @returns {Promise<void | Error>}
 */
export default async function seedData() {
  const existingRecords = await connection.query(
    'SELECT * FROM "Users" WHERE email = $1;',
    [ADMIN_EMAIL],
  );
  const existingRecord = existingRecords.rows[0];
  if (existingRecord) {
    return log('-- database: seeding is not required');
  }

  const [insertionResult, passwordHash] = await Promise.all([
    connection.query(
      `INSERT INTO "Users" (email, "firstName", "lastName") VALUES (
        $1,
        'Admin',
        'Admin'
      ) RETURNING *;`,
      [ADMIN_EMAIL],
    ),
    hash(ADMIN_PASSWORD),
  ]);

  const userRecord = insertionResult.rows[0];
  if (!userRecord) {
    throw new Error('User record was not created during seeding');
  }

  await connection.query(
    `INSERT INTO "Passwords" (hash, "userId") VALUES (
      $1,
      $2
    );`,
    [
      passwordHash,
      userRecord.id,
    ],
  );

  return log('-- database: seeding is done');
}
