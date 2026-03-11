import { useState } from "react";
import { payExpense, setWalletBalance } from "../api/walletApi";
import type { User } from "../types/index";

interface Props {
  walletId: number;
  users: User[];
  refreshData: () => void;
}

export default function StressTest({ walletId, users, refreshData }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const runConcurrentPayments = async (amount: number, count: number) => {
    if (users.length === 0) {
      setMessage("No users available for this department.");
      return;
    }
    const requests = Array.from({ length: count }, (_, i) =>
      payExpense({ walletId, userId: users[i % users.length].id, amount })
    );
    try {
      setLoading(true);
      const results = await Promise.allSettled(requests);
      const successCount = results.filter((r) => r.status === "fulfilled").length;
      const failedCount = results.length - successCount;
      setMessage(`${results.length} requests fired — ✓ ${successCount} succeeded, ✗ ${failedCount} failed`);
    } catch {
      setMessage("Stress test failed to complete.");
    } finally {
      setLoading(false);
      refreshData();
    }
  };

  const runHighVolumeTest = async () => {
    setMessage("");
    await runConcurrentPayments(500, 10);
  };

  const runInsufficientFundsTest = async () => {
    setMessage("");
    try {
      await setWalletBalance({ walletId, balance: 2000 });
      await runConcurrentPayments(1500, 2);
    } catch {
      setMessage("Failed to set balance for the insufficient funds test.");
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <span className="card-title-icon">⚡</span>
        Concurrency Tests
      </h3>

      <div className="stress-buttons">
        <button
          className="btn btn-dark btn-full"
          onClick={runHighVolumeTest}
          disabled={loading}
        >
          Run 10 Concurrent Payments
          <span className="stress-btn-meta">INR 500 each</span>
        </button>

        <button
          className="btn btn-danger btn-full"
          onClick={runInsufficientFundsTest}
          disabled={loading}
        >
          Insufficient Funds Test
          <span className="stress-btn-meta">2× INR 1,500 at balance INR 2,000</span>
        </button>
      </div>

      {loading && (
        <p className="feedback-msg info">Running test, please wait...</p>
      )}

      {message && !loading && (
        <p className={`feedback-msg ${message.includes("✓") ? "success" : message.includes("✗") ? "error" : "info"}`}>
          {message}
        </p>
      )}
    </div>
  );
}