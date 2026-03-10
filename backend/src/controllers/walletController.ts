import { Request, Response } from "express";
import { payExpense } from "../services/walletService";
import { paymentSchema } from "../validators/walletValidator";
import { getWalletBalance } from "../services/walletService";
import { getTransactions } from "../services/walletService";
import { getDepartmentDashboard } from "../services/walletService";

export const payExpenseController = async (req: Request, res: Response) => {
  try {
    const parsed = paymentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.issues
      });
    }

    const { walletId, userId, amount } = parsed.data;

    const result = await payExpense(walletId, userId, amount);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getWalletBalanceController = async (
  req: Request,
  res: Response
) => {
  try {

    const walletId = Number(req.params.walletId);

    const wallet = await getWalletBalance(walletId);

    res.json(wallet);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching wallet"
    });

  }
};

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {

    const walletId = Number(req.params.walletId);

    const transactions = await getTransactions(walletId);

    res.json(transactions);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching transactions"
    });

  }
};

export const departmentDashboardController = async (
  req: Request,
  res: Response
) => {

  try {

    const departmentId = Number(req.params.departmentId);

    const data = await getDepartmentDashboard(departmentId);

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching department"
    });

  }

};