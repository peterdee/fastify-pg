import pg from 'pg';

import { DATABASE_CONNECTION } from '../configuration/index.js';

const pool = new pg.Pool({ connectionString: DATABASE_CONNECTION });

export default pool;
