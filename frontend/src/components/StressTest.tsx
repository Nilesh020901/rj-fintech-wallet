import { payExpense } from "../api/walletApi";

interface Props {
  refreshData: () => void;
}

export default function StressTest({ refreshData }: Props) {

  const runStressTest = async () => {

    const requests = [];

    for (let i = 0; i < 10; i++) {
      requests.push(
        payExpense({
          walletId: 1,
          userId: (i % 3) + 1, // simulate 3 users
          amount: 500
        })
      );
    }

    try {

      const results = await Promise.allSettled(requests);

      console.log("Stress test results:", results);

      refreshData();

      alert("Stress test completed. Check transaction ledger.");

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Concurrency Stress Test</h3>

      <button
        onClick={runStressTest}
        style={{
          padding: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Run 10 Concurrent Payments
      </button>

    </div>
  );
}