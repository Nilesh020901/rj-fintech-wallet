import { useEffect, useState } from "react";
import { getBalance, getTransactions } from "../api/walletApi";
import PaymentForm from "./PaymentForm";
import Transactions from "./Transactions";
import type { Transaction } from "../types/index";
import StressTest from "./StressTest";


export default function Dashboard() {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const loadData = async () => {
        const wallet = await getBalance(1);
        const tx = await getTransactions(1);

        setBalance(wallet.balance);
        setTransactions(tx);
    };

    useEffect(() => {
        loadData();
    }, [])

    return (
        <>
            <h2>Department Wallet</h2>

            <h3>Balance: ₹{balance}</h3>

            <PaymentForm refreshData={loadData} />

            <StressTest refreshData={loadData} />

            <Transactions transactions={transactions} />        
        </>
    )

}