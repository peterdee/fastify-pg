export default `
CREATE TABLE "Users" (
  email VARCHAR(64),
  "firstName" VARCHAR(48),
  id SERIAL PRIMARY KEY,
  "lastName" VARCHAR(48),
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
