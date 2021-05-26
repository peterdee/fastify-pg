import { PREFIXES } from '../../configuration/index.js';
import signInController from './sign-in.controller.js';

/**
 * Router for the Auth APIs
 * @param {FastifyInstance} application - Fastify instance
 * @param {*} options - plugin options
 * @param {*} done - plugin callback
 * @returns {void}
 */
export default function router(application, options, done) {
  application.get(
    `/${PREFIXES.api}/${PREFIXES.auth}/${PREFIXES.signIn}`,
    signInController,
  );

  return done();
}
