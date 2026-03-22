"use client"

import TransactionList from "@/components/transactions/TransactionList"

export default function TransactionsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>
      <TransactionList />
    </div>
  )
}