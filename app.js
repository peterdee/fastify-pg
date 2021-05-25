import fastify from 'fastify';

import connection from './database/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';

const app = fastify({
  logger: true,
});

app.get(
  '/',
  async (_, res) => {
    const { rows: users } = await connection.query('SELECT * from "Users"');
    return res.code(200).send({ info: 'OK', users });
  },
);

process.on('SIGINT', () => gracefulShutdown('SIGINT', app, connection));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM', app, connection));

export default app;
