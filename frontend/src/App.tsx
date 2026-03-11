import "./index.css";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-logo">RJ</div>
        <span className="app-header-title">Finance Expense Wallet</span>
        <span className="app-header-subtitle">Finance Portal</span>
      </header>
      <main className="app-content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;