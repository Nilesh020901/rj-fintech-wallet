import { useState } from "react";
import { payExpense } from "../api/walletApi";

interface Props {
  refreshData: () => void;
}

export default function PaymentForm({ refreshData }: Props) {
    const [userId, setUserId] = useState(1);
    const [amount, setAmount] = useState(500);
    const [message, setMessage] = useState("");

    const handlePayment = async () => {
        try {
            const res = await payExpense({
                walletId: 1,
                userId,
                amount
            });

            setMessage(`✅ Payment successful. New balance: ₹${res.balance}`);
            refreshData();
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Payment failed");
            refreshData();
        }
    }

    return (
    <div style={{ marginTop: "20px" }}>
      <h3>Pay Expense</h3>

      <div>
        <label>User:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button
        style={{ marginTop: "10px" }}
        onClick={handlePayment}
      >
        Pay Expense
      </button>

      {message && (
        <p style={{ marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
}