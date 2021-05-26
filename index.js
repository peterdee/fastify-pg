import applyMigrations from './database/apply-migrations.js';
import buildApplication from './app.js';
import createDatabase from './database/create-database.js';
import log from './utilities/log.js';
import { PORT } from './configuration/index.js';
import seedData from './database/seed-data.js';
import synchronizeDatabase from './database/sync-database.js';

/**
 * Launch the app
 */
(async function start() {
  await createDatabase();
  await synchronizeDatabase();
  await applyMigrations();
  await seedData();

  const app = await buildApplication();
  app.listen(
    PORT,
    () => log(`-- FASTIFY-PG is running on port ${PORT}`),
  );
}());
