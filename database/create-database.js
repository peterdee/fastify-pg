import { exec } from 'child_process';
import { promisify } from 'util';

import { DATABASE_NAME } from '../configuration/index.js';
import log from '../utilities/log.js';

const execPromise = promisify(exec);

/**
 * Create database with PSQL
 * @returns {void | Error}
 */
export default async function createDatabase() {
  try {
    const { stderr } = await execPromise(`createdb ${DATABASE_NAME}`);
    if (stderr) {
      throw stderr;
    }

    return log('-- database: created database');
  } catch (error) {
    const { stderr } = error;
    if (stderr && stderr.includes(`database "${DATABASE_NAME}" already exists`)) {
      return log('-- database: database already exists');
    }

    throw error;
  }
}
