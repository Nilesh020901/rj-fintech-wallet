import { z } from "zod";

export const paymentSchema = z.object({
  walletId: z.number(),
  userId: z.number(),
  amount: z.number().positive()
});