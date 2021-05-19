import { exec } from 'child_process';
import { promisify } from 'util';

import { DATABASE_NAME } from '../configuration/index.js';

const execPromise = promisify(exec);

/**
 * Drop database
 * @returns {void | Error}
 */
export default async function dropDatabase() {
  const { stderr } = await execPromise(
    `psql -U postgres -d postgres -c "DROP DATABASE ${DATABASE_NAME}"`,
  );
  if (stderr) {
    throw stderr;
  }

  return process.exit(0);
}
