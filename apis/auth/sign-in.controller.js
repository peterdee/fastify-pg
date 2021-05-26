import connection from '../../database/index.js';
import response from '../../utilities/response.js';
import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../../configuration/index.js';

/**
 * Sign in controller
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export default async function signIn(req, res) {
  try {
    const { rows: users } = await connection.query('SELECT * from "Users"');
    return response({
      data: users,
      request: req,
      response: res,
    });
  } catch (error) {
    return response({
      request: req,
      response: res,
      info: RESPONSE_MESSAGES.internalServerError,
      status: RESPONSE_STATUSES.internalServerError,
    });
  }
}
