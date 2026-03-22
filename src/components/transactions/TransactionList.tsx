const mockTransactions = [
  { id: 1, amount: 120, status: "Success" },
  { id: 2, amount: 75, status: "Pending" },
  { id: 3, amount: 200, status: "Failed" },
]

export default function TransactionList() {
  return (
    <div className="border rounded-2xl p-4 space-y-3">
      {mockTransactions.map((tx) => (
        <div
          key={tx.id}
          className="flex justify-between p-3 rounded-lg border"
        >
          <span>#{tx.id}</span>
          <span>${tx.amount}</span>
          <span>{tx.status}</span>
        </div>
      ))}
    </div>
  )
}