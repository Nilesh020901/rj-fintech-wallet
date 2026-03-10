import type { Transaction } from "../types/index";

interface Props {
  transactions: Transaction[];
}

export default function Transactions({ transactions }: Props) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Transaction Ledger</h3>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.user}</td>
              <td>₹{t.amount}</td>
              <td>{t.status}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}