import { Router } from "express";
import { payExpenseController, getWalletBalanceController, getTransactionsController, departmentDashboardController } from "../controllers/walletController";

const router = Router();

router.post("/pay", payExpenseController);

router.get("/balance/:walletId", getWalletBalanceController);

router.get("/transactions/:walletId", getTransactionsController);

router.get("/department/:departmentId", departmentDashboardController);

export default router;