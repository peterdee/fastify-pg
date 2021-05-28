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

  const { rows: [result] } = await connection.query(
    `
      INSERT INTO "Migrations" (commentary, "migrationId") VALUES (
        $1,
        $2
      ) RETURNING *;
    `,
    [
      commentary || '',
      migrationId,
    ],
  );
  const { id = null } = result;
  if (!id) {
    throw new Error('Could not create a migration record!');
  }

  const fileName = `${id}-${migrationId}`;
  await fs.writeFile(
    `${process.cwd()}/migrations/${fileName}.js`,
    `// File name: ${fileName}
${commentary ? `// Commentary: ${commentary}` : ''}
export default \`
/* Migration SQL code should be placed here */
\`;
`,
  );

  log(`-- migrations: migration ${fileName} created`);

  await connection.end();
  return process.exit(0);
}());
