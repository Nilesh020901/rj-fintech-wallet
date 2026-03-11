import { useEffect, useState } from "react";
import { payExpense } from "../api/walletApi";
import type { User } from "../types/index";

interface Props {
  walletId: number;
  users: User[];
  refreshData: () => void;
}

export default function PaymentForm({ walletId, users, refreshData }: Props) {
  const [userId, setUserId] = useState<number | null>(null);
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    if (users.length > 0) setUserId(users[0].id);
  }, [users]);

  const handlePayment = async () => {
    if (userId === null) {
      setMessage("Select a user to proceed.");
      setMsgType("error");
      return;
    }
    try {
      const res = await payExpense({ walletId, userId, amount });
      setMessage(`Payment successful. New balance: INR ${res.balance.toLocaleString()}`);
      setMsgType("success");
      refreshData();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Payment failed");
      setMsgType("error");
      refreshData();
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <span className="card-title-icon">💸</span>
        Pay Expense
      </h3>

      <div className="form-group">
        <label className="form-label">Recipient</label>
        <div className="select-wrapper">
          <select
            className="form-select"
            value={userId ?? ""}
            onChange={(e) => setUserId(Number(e.target.value))}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Amount (INR)</label>
        <input
          className="form-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          min={1}
        />
      </div>

      <button className="btn btn-primary btn-full" onClick={handlePayment}>
        Confirm Payment
      </button>

      {message && (
        <p className={`feedback-msg ${msgType}`}>{message}</p>
      )}
    </div>
  );
}