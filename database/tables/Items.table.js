export default `
CREATE TABLE "Items" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256),
  type VARCHAR(64),
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
