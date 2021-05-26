import store from '../store/index.js';

/**
 * Store an incoming timestamp in ALS
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {*} next - exit the middleware
 * @returns {void}
 */
export default function incomingTime(req, res, next) {
  store.enterWith({ incomingTime: Date.now() });

  return next();
}
