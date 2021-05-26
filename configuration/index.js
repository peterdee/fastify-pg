const { env: EV } = process;

export const { ADMIN_EMAIL = '' } = EV;

export const { ADMIN_PASSWORD = '' } = EV;

export const { DATABASE_CONNECTION = '' } = EV;

export const { DATABASE_NAME = '' } = EV;

export const PORT = Number(EV.PORT) || 7700;

export const PREFIXES = {
  api: 'api',
  auth: 'auth',
  signIn: 'sign-in',
  signUp: 'sign-up',
};

export const RESPONSE_MESSAGES = {
  internalServerError: 'INTERNAL_SERVER_ERROR',
  ok: 'OK',
};

export const RESPONSE_STATUSES = {
  accessDenied: 400,
  forbidden: 403,
  internalServerError: 500,
  ok: 200,
  unauthorized: 401,
};
