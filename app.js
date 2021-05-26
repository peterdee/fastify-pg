import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';
import useMiddlewares from 'fastify-express';

import connection from './database/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';
import incomingTime from './middlewares/incoming-time.js';

import signIn from './apis/auth/index.js';

/**
 * Build an application
 * @returns {Promise<FastifyInstance>}
 */
async function buildApplication() {
  const app = fastify({
    logger: true,
  });

  await app.register(cors);
  await app.register(
    favicon,
    {
      name: 'favicon.ico',
      path: './assets',
    },
  );
  await app.register(helmet);
  await app.register(useMiddlewares);

  await app.use(incomingTime);

  await app.register(signIn);

  process.on('SIGINT', () => gracefulShutdown('SIGINT', app, connection));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM', app, connection));

  return app;
}

export default buildApplication;
