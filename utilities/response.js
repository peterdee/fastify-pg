import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../configuration/index.js';
import store from '../store/index.js';

/**
 * Send response to the client
 * @param {*} options - response options
 * @returns {void}
 */
export default function createResponse({
  request,
  response,
  status = RESPONSE_STATUSES.ok,
  info = RESPONSE_MESSAGES.ok,
  data = null,
}) {
  const responseObject = {
    datetime: Date.now(),
    delay: Date.now() - store.getStore().incomingTime,
    info,
    request: `${request.url} [${request.method}]`,
    status,
  };

  if (data) {
    responseObject.data = data;
  }

  return response.code(status).send(responseObject);
}
