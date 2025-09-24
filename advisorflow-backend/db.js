    import pg from 'pg';
    import 'dotenv/config'; // This loads the .env file variables

    const { Pool } = pg;

    // This new configuration is more explicit and robust.
    // It builds the connection options from your individual .env variables
    // and guarantees that the SSL setting is always applied.
    const pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,

      // This is the critical fix. We are forcing the connection
      // to be encrypted, which is required by Azure.
      ssl: {
        rejectUnauthorized: false
      }
    });

    // We are exporting a single object with a 'query' method.
    export default {
      query: (text, params) => pool.query(text, params),
    };



