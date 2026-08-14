import { useState, useEffect } from 'react';
import { Product, Category, Transaction } from './types';
import PremiumPOS from './components/pos/PremiumPOS';
import PremiumTransactions from './components/transactions/PremiumTransactions';
import PremiumProducts from './components/products/PremiumProducts';
import PremiumInventory from './components/inventory/PremiumInventory';

function App() {
  const [currentView, setCurrentView] = useState('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Initialize with sample data
  useEffect(() => {
    if (products.length === 0) {
      setProducts([
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
      ]);
    }
    if (categories.length === 0) {
      setCategories([
        { id: 1, name: 'Food', created_at: Date.now(), updated_at: Date.now() },
        { id: 2, name: 'Drinks', created_at: Date.now(), updated_at: Date.now() },
      ]);
    }
  }, []);

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

  const navItems = [
    { id: 'pos', label: 'POS', icon: '🛒' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'inventory', label: 'Inventory', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'devices', label: 'Devices', icon: '🔌' },
    { id: 'printers', label: 'Printers', icon: '🖨️' },
    { id: 'receipts', label: 'Receipts', icon: '🧾' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface-primary backdrop-blur-md">
        <div className="flex items-center gap-4">
          <img 
            src="/src/assets/openpos-logo.png" 
            alt="OpenPOS" 
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.src = 'https://i.imgur.com/UfIW5E7.png';
            }}
          />
          <h1 className="text-xl font-semibold text-text-primary">OpenPOS</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-64 px-4 py-2 pl-10 rounded-lg bg-surface-secondary border-border text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-secondary border-border flex items-center justify-center hover:bg-surface-primary transition-colors">
            <span className="text-lg">👤</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border bg-surface-primary backdrop-blur-md flex flex-col">
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="glass-strong rounded-lg p-3">
              <p className="text-xs text-text-secondary mb-1">Today's Sales</p>
              <p className="text-lg font-semibold text-text-primary">$1,234.56</p>
              <p className="text-xs text-text-secondary mt-1">24 transactions</p>
            </div>
          </div>
        </aside>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {currentView === 'pos' ? (
              <PremiumPOS products={products} categories={categories} />
            ) : currentView === 'transactions' ? (
              <PremiumTransactions transactions={sampleTransactions} />
            ) : currentView === 'products' ? (
              <PremiumProducts 
                products={products}
                categories={categories}
                onUpdateProducts={setProducts}
                onUpdateCategories={setCategories}
              />
            ) : currentView === 'inventory' ? (
              <PremiumInventory 
                products={products}
                categories={categories}
                onUpdateProducts={setProducts}
              />
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-semibold text-text-primary mb-2 capitalize">{currentView}</h2>
                  <p className="text-text-secondary">
                    {currentView === 'customers' && 'Manage customer information'}
                    {currentView === 'devices' && 'Configure hardware devices'}
                    {currentView === 'printers' && 'Manage receipt printers'}
                    {currentView === 'receipts' && 'Design receipt templates'}
                    {currentView === 'payments' && 'Configure payment providers'}
                    {currentView === 'reports' && 'View sales analytics'}
                    {currentView === 'settings' && 'Configure application settings'}
                  </p>
                </div>

                {/* Feature Coming Soon */}
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-secondary flex items-center justify-center">
                    <span className="text-4xl">🚧</span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Under Construction</h3>
                  <p className="text-text-secondary max-w-md mx-auto">
                    This feature is being implemented with the new premium design system. 
                    Check back soon for updates.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
