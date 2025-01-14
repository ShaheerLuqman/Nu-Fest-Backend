import dotenv from "dotenv";
import pkg from "pg";

dotenv.config(); // Ensure this is called before accessing process.env
const { Pool } = pkg;

const connectionString = process.env.DBPORT;

const pool = new Pool({
  connectionString,
});

pool.connect((err) => {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Connected to database");
  }
});

export default pool;
