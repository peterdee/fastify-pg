import { exec } from 'child_process';
import { promisify } from 'util';

import { DATABASE_NAME } from '../configuration/index.js';

const execPromise = promisify(exec);

/**
 * Create database with PSQL
 * @returns {null | Error}
 */
export default async function createDatabase() {
  try {
    const { stderr } = await execPromise(`createdb ${DATABASE_NAME}`);
    if (stderr) {
      throw stderr;
    }

    return null;
  } catch (error) {
    const { stderr } = error;
    if (stderr && stderr.includes(`database "${DATABASE_NAME}" already exists`)) {
      return null;
    }

    throw error;
  }
}
