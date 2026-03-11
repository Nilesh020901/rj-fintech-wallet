import type { Transaction } from "../types/index";

interface Props {
  transactions: Transaction[];
}

function getStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "success" || s === "completed") return "success";
  if (s === "failed" || s === "error") return "failed";
  return "pending";
}

export default function Transactions({ transactions }: Props) {
  return (
    <div className="card transactions-card animate-in">
      <h3 className="card-title">
        <span className="card-title-icon">📒</span>
        Transaction Ledger
        <span style={{ marginLeft: "auto", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontWeight: 400 }}>
          {transactions.length} records
        </span>
      </h3>

      <div className="table-wrapper">
        <table className="tx-table">
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="tx-empty">No transactions yet</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td className="tx-id">#{t.id}</td>
                  <td className="tx-user">{t.user}</td>
                  <td className="tx-amount debit">− INR {Number(t.amount).toLocaleString()}</td>
                  <td>
                    <span className={`tx-status-badge ${getStatusClass(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="tx-time">{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}