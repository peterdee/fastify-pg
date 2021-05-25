import log from './log.js';

/**
 * Shut down server gracefully
 * @param {string} signal - termination signal
 * @param {FastifyInstance} application - Fastify instance
 * @param {Pool} connection - database connection
 * @returns {Promise<void>}
 */
export default async function gracefulShutdown(signal = '', application, connection) {
  log(`-- graceful shutdown: initiated [${signal}]`);

  try {
    await application.close();
    await connection.end();
  } catch (error) {
    log(error);
    return process.exit(1);
  }

  return log('-- graceful shutdown: done');
}
