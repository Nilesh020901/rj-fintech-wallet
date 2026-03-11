import { z } from "zod";

export const paymentSchema = z.object({
  walletId: z.number(),
  userId: z.number(),
  amount: z.number().positive()
});

export const walletBalanceSchema = z.object({
  walletId: z.number(),
  balance: z.number().min(0)
});
