import { pool } from "../config/db";

export const payExpense = async (
    walletId: number,
    userId: number,
    amount: number
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const debitResult = await client.query(
            `
            UPDATE wallets w
            SET balance = w.balance - $1
            FROM users u
            WHERE w.id = $2
              AND u.id = $3
              AND u.department_id = w.department_id
              AND w.balance >= $1
            RETURNING w.balance
            `,
            [amount, walletId, userId]
        );

        if (debitResult.rows.length === 0) {
            const walletResult = await client.query(
                `SELECT id, department_id FROM wallets WHERE id = $1`,
                [walletId]
            );

            if (walletResult.rows.length === 0) {
                throw new Error("Wallet not found");
            }

            const userResult = await client.query(
                `SELECT id, department_id FROM users WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                throw new Error("User not found");
            }

            if (userResult.rows[0].department_id !== walletResult.rows[0].department_id) {
                await client.query("COMMIT");
                return {
                    success: false,
                    message: "User not authorized for this wallet",
                    statusCode: 403
                };
            }

            await client.query(
                `INSERT INTO transactions (wallet_id, user_id, amount, status)
                VALUES ($1,$2,$3,$4)`,
                [walletId, userId, amount, "FAILED"]
            );

            await client.query("COMMIT");

            return {
                success: false,
                message: "Insufficient funds",
                statusCode: 409
            };
        }

        const newBalance = Number(debitResult.rows[0].balance);

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

  return {
    id: result.rows[0].id,
    balance: Number(result.rows[0].balance)
  };
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

  return result.rows.map((row) => ({
    ...row,
    amount: Number(row.amount)
  }));
};

export const getDepartmentDashboard = async (departmentId: number) => {

  const result = await pool.query(
    `
    SELECT 
      d.id as department_id,
      d.name as department_name,
      w.id as wallet_id,
      w.balance
    FROM departments d
    JOIN wallets w ON w.department_id = d.id
    WHERE d.id = $1
    `,
    [departmentId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    department_id: result.rows[0].department_id,
    department_name: result.rows[0].department_name,
    wallet_id: result.rows[0].wallet_id,
    balance: Number(result.rows[0].balance)
  };
};

export const getDepartments = async () => {
  const result = await pool.query(
    `
    SELECT 
      d.id as department_id,
      d.name as department_name,
      w.id as wallet_id,
      w.balance
    FROM departments d
    JOIN wallets w ON w.department_id = d.id
    ORDER BY d.id
    `
  );

  return result.rows.map((row) => ({
    department_id: row.department_id,
    department_name: row.department_name,
    wallet_id: row.wallet_id,
    balance: Number(row.balance)
  }));
};

export const getDepartmentUsers = async (departmentId: number) => {
  const result = await pool.query(
    `
    SELECT id, name
    FROM users
    WHERE department_id = $1
    ORDER BY id
    `,
    [departmentId]
  );

  return result.rows;
};

export const setWalletBalance = async (walletId: number, balance: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const walletResult = await client.query(
      `SELECT id FROM wallets WHERE id = $1 FOR UPDATE`,
      [walletId]
    );

    if (walletResult.rows.length === 0) {
      throw new Error("Wallet not found");
    }

    await client.query(
      `UPDATE wallets SET balance = $1 WHERE id = $2`,
      [balance, walletId]
    );

    await client.query("COMMIT");

    return { success: true, balance };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
