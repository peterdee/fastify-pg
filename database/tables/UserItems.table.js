export default `
CREATE TABLE "UserItems" (
  id SERIAL PRIMARY KEY,
  "itemId" INT,
  "userId" INT,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
`;
