import { Router } from "express";
import {
  payExpenseController,
  getWalletBalanceController,
  getTransactionsController,
  departmentDashboardController,
  departmentsController,
  departmentUsersController,
  setWalletBalanceController
} from "../controllers/walletController";

const router = Router();

router.post("/pay", payExpenseController);

router.get("/balance/:walletId", getWalletBalanceController);

router.get("/transactions/:walletId", getTransactionsController);

router.get("/department/:departmentId", departmentDashboardController);

router.get("/departments", departmentsController);

router.get("/department/:departmentId/users", departmentUsersController);

router.post("/balance", setWalletBalanceController);

export default router;
