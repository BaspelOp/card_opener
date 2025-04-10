import { Pool } from "pg";

const pool = new Pool({
  user: "app",
  password: "app",
  host: "192.168.0.5",
  port: 5432,
  database: "app"
});

export default pool;
