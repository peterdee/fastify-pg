const { env: EV } = process;

export const { DATABASE_CONNECTION = '' } = EV;

export const { DATABASE_NAME = '' } = EV;

export const PORT = Number(EV.PORT) || 7700;
