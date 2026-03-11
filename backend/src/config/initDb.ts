import fs from "fs/promises";
import path from "path";
import { pool } from "./db";

let initialized = false;

export const initDb = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  const schemaPath = path.resolve(__dirname, "../../sql/schema.sql");
  const schemaSql = await fs.readFile(schemaPath, "utf-8");
  await pool.query(schemaSql);

  const seedCheck = await pool.query(`SELECT COUNT(*)::int AS count FROM departments`);
  if (seedCheck.rows[0].count === 0) {
    const seedPath = path.resolve(__dirname, "../../sql/seed.sql");
    const seedSql = await fs.readFile(seedPath, "utf-8");
    await pool.query(seedSql);
  }

  initialized = true;
};
