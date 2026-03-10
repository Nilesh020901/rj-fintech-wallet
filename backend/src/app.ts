import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import walletRoutes from "./routes/walletRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.use("/api/wallet", walletRoutes);

export default app;