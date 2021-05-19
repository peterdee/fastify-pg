import fastify from 'fastify';

import pool from './database/index.js';

const app = fastify({
  logger: true,
});

app.get(
  '/',
  async (_, res) => {
    const { rows: users } = await pool.query('SELECT * from "Users"');
    return res.code(200).send({ info: 'OK', users });
  },
);

export default app;
