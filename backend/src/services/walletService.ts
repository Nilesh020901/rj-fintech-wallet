import { pool } from "../config/db";

export const payExpense = async (
    walletId: number,
    userId: number,
    amount: number
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const walletResult = await client.query(
            `SELECT * FROM wallets WHERE id = $1 FOR UPDATE`,
            [walletId]
        );

        if (walletResult.rows.length === 0) {
            throw new Error("Wallet not found");
        }

        const wallet = walletResult.rows[0];
        const currentBalance = Number(wallet.balance);

        if (currentBalance < amount) {
            await client.query(
                `INSERT INTO transactions (wallet_id, user_id, amount, status)
                VALUES ($1,$2,$3,$4)`,
                [walletId, userId, amount, "FAILED"]
            )

            await client.query("ROLLBACK");
            return {
                success: false,
                message: "Insufficient funds",
            };
        }

        const newBalance = currentBalance - amount;
        await client.query(
            `UPDATE wallets SET balance=$1 WHERE id=$2`,
            [newBalance, walletId]
        );

        await client.query(
            `INSERT INTO transactions (wallet_id, user_id, amount, status)
            VALUES ($1,$2,$3,$4)`,
            [walletId, userId, amount, "SUCCESS"]
        );

        await client.query("COMMIT");

        return {
            success: true,
            balance: newBalance,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export const getWalletBalance = async (walletId: number) => {

  const result = await pool.query(
    `SELECT id, balance FROM wallets WHERE id = $1`,
    [walletId]
  );

  if (result.rows.length === 0) {
    throw new Error("Wallet not found");
  }

  return result.rows[0];
};

export const getTransactions = async (walletId: number) => {

  const result = await pool.query(
    `
    SELECT t.id, t.amount, t.status, t.created_at, u.name as user
    FROM transactions t
    JOIN users u ON u.id = t.user_id
    WHERE wallet_id = $1
    ORDER BY created_at DESC
    `,
    [walletId]
  );

  return result.rows;
};

export const getDepartmentDashboard = async (departmentId: number) => {

  const result = await pool.query(
    `
    SELECT 
      d.id as department_id,
      d.name as department_name,
      w.balance
    FROM departments d
    JOIN wallets w ON w.department_id = d.id
    WHERE d.id = $1
    `,
    [departmentId]
  );

  return result.rows[0];
};