import bodyParser from 'fastify-formbody';
import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';
import limiter from 'fastify-rate-limit';
import useMiddlewares from 'fastify-express';

import connection from './database/index.js';
import gracefulShutdown from './utilities/graceful-shutdown.js';
import incomingTime from './middlewares/incoming-time.js';
import response from './utilities/response.js';

import signIn from './apis/auth/index.js';
import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from './configuration/index.js';

/**
 * Build an application
 * @returns {Promise<FastifyInstance>}
 */
async function buildApplication() {
  const app = fastify({
    logger: true,
  });

  await app.register(bodyParser);
  await app.register(cors);
  await app.register(
    favicon,
    {
      name: 'favicon.ico',
      path: './assets',
    },
  );
  await app.register(helmet);
  await app.register(
    limiter,
    {
      global: true,
      max: 100,
      timeWindow: 60 * 1000,
    },
  );
  await app.register(useMiddlewares);

  await app.use(incomingTime);

  await app.register(signIn);

  await app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 10,
        timeWindow: 5000,
      }),
    },
    (req, res) => response({
      info: RESPONSE_MESSAGES.notFound,
      request: req,
      response: res,
      status: RESPONSE_STATUSES.notFound,
    }),
  );

  process.on('SIGINT', () => gracefulShutdown('SIGINT', app, connection));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM', app, connection));

  return app;
}

export default buildApplication;
