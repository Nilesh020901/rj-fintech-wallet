CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department_id INT REFERENCES departments(id)
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id),
    balance NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INT REFERENCES wallets(id),
    user_id INT REFERENCES users(id),
    amount NUMERIC(12,2),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_department
ON wallets(department_id);

CREATE INDEX idx_transactions_wallet
ON transactions(wallet_id);

CREATE INDEX idx_transactions_created
ON transactions(created_at);