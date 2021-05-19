import { exec } from 'child_process';
import { promisify } from 'util';

import { DATABASE_NAME } from '../configuration/index.js';
import log from '../utilities/log.js';

const execPromise = promisify(exec);

/**
 * Drop database
 * @returns {void | Error}
 */
(async function dropDatabase() {
  const { stderr } = await execPromise(`dropdb ${DATABASE_NAME}`);
  if (stderr) {
    throw stderr;
  }

  log(`-- database: dropped database ${DATABASE_NAME}`);
  return process.exit(0);
}());
