export default `
CREATE TABLE "UserSecrets" (
  id SERIAL PRIMARY KEY,
  secret VARCHAR(256),
  "userId" INT,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
