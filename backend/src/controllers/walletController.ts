import { Request, Response } from "express";
import {
  payExpense,
  getWalletBalance,
  getTransactions,
  getDepartmentDashboard,
  getDepartments,
  getDepartmentUsers,
  setWalletBalance
} from "../services/walletService";
import { paymentSchema, walletBalanceSchema } from "../validators/walletValidator";

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
      const statusCode = result.statusCode ?? 400;
      return res.status(statusCode).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "Wallet not found") {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(500).json({
      message: "Internal server error"
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

    if (error instanceof Error && error.message === "Wallet not found") {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

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

    if (!data) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching department"
    });

  }

};

export const departmentsController = async (req: Request, res: Response) => {
  try {
    const data = await getDepartments();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching departments"
    });
  }
};

export const departmentUsersController = async (req: Request, res: Response) => {
  try {
    const departmentId = Number(req.params.departmentId);
    const users = await getDepartmentUsers(departmentId);
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching department users"
    });
  }
};

export const setWalletBalanceController = async (req: Request, res: Response) => {
  try {
    const parsed = walletBalanceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.issues
      });
    }

    const { walletId, balance } = parsed.data;
    const result = await setWalletBalance(walletId, balance);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating wallet balance"
    });
  }
};
