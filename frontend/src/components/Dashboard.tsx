import { useEffect, useState } from "react";
import {
  getBalance,
  getTransactions,
  getDepartments,
  getDepartmentUsers
} from "../api/walletApi";
import PaymentForm from "./PaymentForm";
import Transactions from "./Transactions";
import type { Department, Transaction, User } from "../types/index";
import StressTest from "./StressTest";

export default function Dashboard() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
    if (data.length > 0) {
      setActiveDepartmentId(data[0].department_id);
      setActiveWalletId(data[0].wallet_id);
    }
  };

  const loadDepartmentData = async (departmentId: number, walletId: number) => {
    const [wallet, tx, deptUsers] = await Promise.all([
      getBalance(walletId),
      getTransactions(walletId),
      getDepartmentUsers(departmentId)
    ]);
    setBalance(wallet.balance);
    setTransactions(tx);
    setUsers(deptUsers);
  };

  const refreshData = async () => {
    if (activeDepartmentId === null || activeWalletId === null) return;
    await loadDepartmentData(activeDepartmentId, activeWalletId);
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => { loadDepartments(); }, []);

  useEffect(() => {
    if (activeDepartmentId === null || activeWalletId === null) return;
    loadDepartmentData(activeDepartmentId, activeWalletId);
  }, [activeDepartmentId, activeWalletId]);

  return (
    <>
      {/* Department Tabs */}
      <div className="dept-tabs-wrapper animate-in">
        <p className="section-heading">Departments</p>
        <div className="dept-tabs">
          {departments.map((dept) => (
            <button
              key={dept.department_id}
              className={`dept-tab${activeDepartmentId === dept.department_id ? " active" : ""}`}
              onClick={() => {
                setActiveDepartmentId(dept.department_id);
                setActiveWalletId(dept.wallet_id);
              }}
            >
              <span className="dept-tab-name">{dept.department_name}</span>
              <span className="dept-tab-balance">INR {dept.balance.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {activeWalletId !== null && (
        <>
          {/* Balance Card */}
          <div className="balance-section animate-in">
            <div className="balance-card">
              <div>
                <p className="balance-card-label">Available Balance</p>
                <p className="balance-card-amount">
                  <span className="balance-card-currency">INR</span>
                  {balance.toLocaleString()}
                </p>
              </div>
              <div className="balance-card-indicator">Active Wallet</div>
            </div>
          </div>

          {/* Two-column grid: Payment + Stress Test */}
          <div className="main-grid animate-in">
            <PaymentForm
              walletId={activeWalletId}
              users={users}
              refreshData={refreshData}
            />
            <StressTest
              walletId={activeWalletId}
              users={users}
              refreshData={refreshData}
            />
          </div>

          {/* Transactions */}
          <Transactions transactions={transactions} />
        </>
      )}
    </>
  );
}