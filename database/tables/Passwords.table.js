export default `
CREATE TABLE "Passwords" (
  id SERIAL PRIMARY KEY,
  hash VARCHAR(256),
  "userId" INT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
