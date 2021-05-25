import connection from './index.js';
import log from '../utilities/log.js';

import ItemsTable from './tables/Items.table.js';
import MigrationsTable from './tables/Migrations.table.js';
import PasswordsTable from './tables/Passwords.table.js';
import UserItemsTable from './tables/UserItems.table.js';
import UserSecretsTable from './tables/UserSecrets.table.js';
import UsersTable from './tables/Users.table.js';

/**
 * Synchronize database
 * @returns {null | Error}
 */
export default async function syncDatabase() {
  const tables = [
    ItemsTable,
    MigrationsTable,
    PasswordsTable,
    UserItemsTable,
    UserSecretsTable,
    UsersTable,
  ];

  /* eslint-disable-next-line */
  for await (let table of tables) {
    try {
      await connection.query(table);
    } catch (error) {
      const { message } = error;
      if (!message || !message.includes('already exists')) {
        throw error;
      }
    }
  }

  return log('-- database: synchronization is done');
}
