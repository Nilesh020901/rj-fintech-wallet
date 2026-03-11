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

export const getDepartments = async () => {
  const res = await API.get("/departments");
  return res.data;
};

export const getDepartmentUsers = async (departmentId: number) => {
  const res = await API.get(`/department/${departmentId}/users`);
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

export const setWalletBalance = async (data: {
  walletId: number;
  balance: number;
}) => {
  const res = await API.post("/balance", data);
  return res.data;
};
