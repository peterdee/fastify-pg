// Migration ID: ld087si
// Commentary: Update 'email' field in 'Users' table
export default `
  ALTER TABLE "Users" ALTER COLUMN email SET NOT NULL;
`;
