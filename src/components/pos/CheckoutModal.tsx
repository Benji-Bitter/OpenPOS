import { useState } from 'react';
import { CartItem, Transaction } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  onComplete: (transaction: Transaction) => void;
}

type PaymentMethod = 'cash' | 'card' | 'other';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  subtotal, 
  tax, 
  discount, 
  total, 
  onComplete 
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const change = parseFloat(amountReceived) - (total / 100);
  const isValidPayment = paymentMethod === 'cash' 
    ? parseFloat(amountReceived) >= (total / 100)
    : true;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing (in real implementation, use payment provider)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create transaction
    const transaction: Transaction = {
      transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider_transaction_id: `provider_${Date.now()}`,
      amount_cents: total,
      currency: 'USD',
      payment_provider: paymentMethod === 'card' ? 'Stripe' : 'OpenPOS',
      payment_method: paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'card' ? 'Card' : 'Other',
      status: 'completed',
      terminal_id: 'terminal-1',
      tax_cents: tax,
      discount_cents: discount,
      subtotal_cents: subtotal,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    setIsComplete(true);
    setIsProcessing(false);
    onComplete(transaction);
  };

  const handleNewTransaction = () => {
    setIsComplete(false);
    setAmountReceived('');
    onClose();
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Transaction completed successfully
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            {paymentMethod === 'cash' && amountReceived && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Amount Received</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${parseFloat(amountReceived).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Change</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${change.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleNewTransaction}
              className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${((item.product.price_cents * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${(subtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${(tax / 100).toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -${(discount / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">💵</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Cash</div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Card</div>
              </button>
              <button
                onClick={() => setPaymentMethod('other')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'other'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Other</div>
              </button>
            </div>
          </div>

          {/* Cash Payment */}
          {paymentMethod === 'cash' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Amount Received</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[20, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAmountReceived(amount.toString())}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
              {amountReceived && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 dark:text-gray-400">Change</span>
                    <span className={`font-bold ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${change.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div className="mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Card Payment</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Ready to process card payment via Stripe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !isValidPayment}
            className="w-full py-4 bg-primary-500 text-white rounded-lg font-bold text-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay $${(total / 100).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
