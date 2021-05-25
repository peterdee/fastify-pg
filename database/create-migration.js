import { promises as fs } from 'fs';
import cuid from 'cuid';

import connection from './index.js';
import log from '../utilities/log.js';

/**
 * Create migration file and store a record about it
 */
(async function createMigration() {
  const commentary = process.argv[2];
  const migrationId = cuid.slug();

  const migrationsPath = `${process.cwd()}/migrations`;

  try {
    await fs.access(migrationsPath);
  } catch (error) {
    const { message = '' } = error;
    if (message && message.includes('ENOENT')) {
      await fs.mkdir(migrationsPath);
      log('-- migrations: created migrations directory');
    }
  }

  await Promise.all([
    connection.query(
      `
        INSERT INTO "Migrations" (commentary, "migrationId") VALUES (
          $1,
          $2
        );
      `,
      [
        commentary || '',
        migrationId,
      ],
    ),
    fs.writeFile(
      `${process.cwd()}/migrations/${migrationId}.js`,
      `// Migration ID: ${migrationId}
${commentary ? `// Commentary: ${commentary}` : ''}
export default \`
  /* Migration SQL code here */
\`;
`,
    ),
  ]);

  log(`-- migrations: migration ${migrationId} created`);

  await connection.end();
  return process.exit(0);
}());
