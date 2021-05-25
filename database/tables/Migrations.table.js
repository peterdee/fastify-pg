export default `
CREATE TABLE "Migrations" (
  id SERIAL PRIMARY KEY,
  applied BOOLEAN DEFAULT FALSE,
  commentary TEXT,
  "migrationId" VARCHAR(256),
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
