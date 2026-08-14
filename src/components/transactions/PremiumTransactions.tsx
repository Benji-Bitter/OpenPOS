import { useState } from 'react';
import { Transaction } from '../../types';

interface PremiumTransactionsProps {
  transactions: Transaction[];
}

export default function PremiumTransactions({ transactions }: PremiumTransactionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.payment_method.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesPaymentMethod = paymentMethodFilter === 'all' ||
      transaction.payment_method.toLowerCase().includes(paymentMethodFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatCents = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'failed':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'refunded':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions... Try 'Stripe payments yesterday' or 'Refunds this week'"
              className="w-full px-4 py-3 pl-12 rounded-xl bg-surface-primary border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="all">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Transaction Table */}
      <div className="flex-1 overflow-auto glass rounded-2xl">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Provider</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">📋</span>
                    <p className="text-text-secondary">
                      {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="border-b border-border hover:bg-surface-secondary cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-text-primary">{transaction.transaction_id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transaction.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transaction.payment_provider}</td>
                  <td className="px-6 py-4 text-right font-semibold text-text-primary">
                    ${formatCents(transaction.amount_cents)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border bg-surface-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Transaction Info */}
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                    Transaction Information
                  </h3>
                  <div className="glass rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Transaction ID</span>
                      <span className="font-mono text-sm text-text-primary">
                        {selectedTransaction.transaction_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Date</span>
                      <span className="text-text-primary">
                        {formatDate(selectedTransaction.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Payment Method</span>
                      <span className="text-text-primary">
                        {selectedTransaction.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Payment Provider</span>
                      <span className="text-text-primary">
                        {selectedTransaction.payment_provider}
                      </span>
                    </div>
                    {selectedTransaction.provider_transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Provider Transaction ID</span>
                        <span className="font-mono text-sm text-text-primary">
                          {selectedTransaction.provider_transaction_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Info */}
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                    Financial Details
                  </h3>
                  <div className="glass rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary">
                        ${formatCents(selectedTransaction.subtotal_cents)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tax</span>
                      <span className="text-text-primary">
                        ${formatCents(selectedTransaction.tax_cents)}
                      </span>
                    </div>
                    {selectedTransaction.discount_cents > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Discount</span>
                        <span className="text-red-600 dark:text-red-400">
                          -${formatCents(selectedTransaction.discount_cents)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span className="text-text-primary">Total</span>
                      <span className="text-primary-500">
                        ${formatCents(selectedTransaction.amount_cents)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface-secondary">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
