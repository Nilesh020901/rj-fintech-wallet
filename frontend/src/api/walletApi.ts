import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/wallet"
});

export const getBalance = async (walletId: number) => {
  const res = await API.get(`/balance/${walletId}`);
  return res.data;
};

export const getTransactions = async (walletId: number) => {
  const res = await API.get(`/transactions/${walletId}`);
  return res.data;
};

export const payExpense = async (data: {
  walletId: number;
  userId: number;
  amount: number;
}) => {
  const res = await API.post("/pay", data);
  return res.data;
};