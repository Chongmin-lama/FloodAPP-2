import sql from 'mssql';

const config: sql.config = {
  server: 'MSI',
  database: 'FloodWatch',
  user: 'sa',
  password: 'a',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool(config).connect();
      console.log('Connected to FloodWatch');
    } catch (err: any) {
      console.error('DB failed:', err.message);
      throw err;
    }
  }
  return pool;
}

export default sql;