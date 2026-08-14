import { useState } from 'react';
import POSInterface from './components/pos/POSInterface';
import TransactionHistory from './components/transactions/TransactionHistory';
import { Product, Category, Transaction } from './types';

function App() {
  const [currentView, setCurrentView] = useState('pos');
  
  // Sample data for development
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: 'Coffee',
      description: 'Fresh brewed coffee',
      price_cents: 450,
      category_id: 1,
      sku: 'COF001',
      tax_rate_cents: 36,
      stock_quantity: 50,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 2,
      name: 'Sandwich',
      description: 'Club sandwich',
      price_cents: 900,
      category_id: 1,
      sku: 'SND001',
      tax_rate_cents: 72,
      stock_quantity: 25,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 3,
      name: 'Salad',
      description: 'Caesar salad',
      price_cents: 750,
      category_id: 1,
      sku: 'SAL001',
      tax_rate_cents: 60,
      stock_quantity: 30,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 4,
      name: 'Pizza Slice',
      description: 'Pepperoni slice',
      price_cents: 350,
      category_id: 1,
      sku: 'PIZ001',
      tax_rate_cents: 28,
      stock_quantity: 40,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 5,
      name: 'Burger',
      description: 'Classic cheeseburger',
      price_cents: 850,
      category_id: 1,
      sku: 'BUR001',
      tax_rate_cents: 68,
      stock_quantity: 20,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 6,
      name: 'Soda',
      description: 'Coca-Cola',
      price_cents: 200,
      category_id: 2,
      sku: 'DRK001',
      tax_rate_cents: 16,
      stock_quantity: 100,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 7,
      name: 'Water',
      description: 'Bottled water',
      price_cents: 150,
      category_id: 2,
      sku: 'DRK002',
      tax_rate_cents: 12,
      stock_quantity: 75,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: 8,
      name: 'Juice',
      description: 'Orange juice',
      price_cents: 300,
      category_id: 2,
      sku: 'DRK003',
      tax_rate_cents: 24,
      stock_quantity: 45,
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ];

  const sampleCategories: Category[] = [
    { id: 1, name: 'Food', created_at: Date.now(), updated_at: Date.now() },
    { id: 2, name: 'Drinks', created_at: Date.now(), updated_at: Date.now() },
  ];

  const sampleTransactions: Transaction[] = [
    {
      transaction_id: 'txn_1234567890_abc123',
      provider_transaction_id: 'provider_1234567890',
      amount_cents: 1350,
      currency: 'USD',
      payment_provider: 'OpenPOS',
      payment_method: 'Cash',
      status: 'completed',
      terminal_id: 'terminal-1',
      tax_cents: 108,
      discount_cents: 0,
      subtotal_cents: 1242,
      created_at: Math.floor(Date.now() / 1000) - 3600,
      updated_at: Math.floor(Date.now() / 1000) - 3600,
    },
    {
      transaction_id: 'txn_1234567891_def456',
      provider_transaction_id: 'provider_1234567891',
      amount_cents: 900,
      currency: 'USD',
      payment_provider: 'Stripe',
      payment_method: 'Card',
      status: 'completed',
      terminal_id: 'terminal-1',
      tax_cents: 72,
      discount_cents: 0,
      subtotal_cents: 828,
      created_at: Math.floor(Date.now() / 1000) - 7200,
      updated_at: Math.floor(Date.now() / 1000) - 7200,
    },
    {
      transaction_id: 'txn_1234567892_ghi789',
      provider_transaction_id: 'provider_1234567892',
      amount_cents: 2500,
      currency: 'USD',
      payment_provider: 'OpenPOS',
      payment_method: 'Cash',
      status: 'completed',
      terminal_id: 'terminal-1',
      tax_cents: 200,
      discount_cents: 500,
      subtotal_cents: 2800,
      created_at: Math.floor(Date.now() / 1000) - 86400,
      updated_at: Math.floor(Date.now() / 1000) - 86400,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OP</span>
          </div>
          <h1 className="text-lg font-semibold">OpenPOS</h1>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentView('pos')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'pos' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              POS
            </button>
            <button 
              onClick={() => setCurrentView('transactions')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'transactions' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Transactions
            </button>
            <button 
              onClick={() => setCurrentView('products')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'products' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => setCurrentView('inventory')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'inventory' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setCurrentView('customers')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'customers' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Customers
            </button>
            <button 
              onClick={() => setCurrentView('devices')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'devices' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Devices
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentView === 'settings' 
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </aside>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          {currentView === 'pos' && (
            <POSInterface 
              products={sampleProducts}
              categories={sampleCategories}
              discountsEnabled={true}
            />
          )}
          {currentView === 'transactions' && (
            <TransactionHistory transactions={sampleTransactions} />
          )}
          {currentView !== 'pos' && currentView !== 'transactions' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 capitalize">{currentView}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This feature is coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
