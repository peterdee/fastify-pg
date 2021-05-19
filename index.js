import app from './app.js';
import createDatabase from './database/create-database.js';
import log from './utilities/log.js';
import { PORT } from './configuration/index.js';
import synchronizeDatabase from './database/sync-database.js';

/**
 * Launch the app
 */
(async function start() {
  await createDatabase();
  await synchronizeDatabase();

  await app.listen(
    PORT,
    () => log(`-- FASTIFY-PG is running on port ${PORT}`),
  );
}());
