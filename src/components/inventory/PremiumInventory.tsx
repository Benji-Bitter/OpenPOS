import { useState } from 'react';
import { Product, Category } from '../../types';

interface PremiumInventoryProps {
  products: Product[];
  categories: Category[];
  onUpdateProducts: (products: Product[]) => void;
}

interface StockAdjustment {
  productId: number;
  productName: string;
  fromQuantity: number;
  toQuantity: number;
  reason: string;
  user: string;
  timestamp: number;
}

export default function PremiumInventory({ 
  products, 
  categories, 
  onUpdateProducts 
}: PremiumInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const stock = product.stock_quantity || 0;
    const matchesLowStock = !showLowStockOnly || stock < 10;
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const handleStockAdjustment = (newQuantity: number, reason: string) => {
    if (!adjustingProduct) return;

    const adjustment: StockAdjustment = {
      productId: adjustingProduct.id!,
      productName: adjustingProduct.name,
      fromQuantity: adjustingProduct.stock_quantity || 0,
      toQuantity: newQuantity,
      reason,
      user: 'Admin',
      timestamp: Date.now(),
    };

    setStockAdjustments([adjustment, ...stockAdjustments]);
    onUpdateProducts(
      products.map(p => 
        p.id === adjustingProduct.id 
          ? { ...p, stock_quantity: newQuantity, updated_at: Date.now() }
          : p
      )
    );
    setShowAdjustModal(false);
    setAdjustingProduct(null);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (quantity < 10) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: 'In Stock', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
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
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 rounded-xl bg-surface-primary border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={selectedCategory || 'all'}
          onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : Number(e.target.value))}
          className="px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-primary border-border cursor-pointer hover:bg-surface-secondary transition-all">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-text-secondary">Low Stock Only</span>
        </label>
      </div>

      {/* Inventory Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid gap-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-text-secondary">
                {products.length === 0 ? 'No products in inventory' : 'No products match your filters'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stock = product.stock_quantity || 0;
              const status = getStockStatus(stock);
              return (
                <div
                  key={product.id}
                  className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {product.name}
                        </h3>
                        {product.sku && (
                          <span className="px-3 py-1 bg-surface-secondary rounded-lg text-xs text-text-secondary">
                            SKU: {product.sku}
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="font-medium text-text-primary">
                          Stock: {stock}
                        </span>
                        <span>•</span>
                        <span>Price: ${(product.price_cents / 100).toFixed(2)}</span>
                        <span>•</span>
                        <span>{categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAdjustingProduct(product);
                        setShowAdjustModal(true);
                      }}
                      className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-sm"
                    >
                      Adjust Stock
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Audit Log */}
        {stockAdjustments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">Stock Adjustment Log</h2>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">From</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">To</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Change</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAdjustments.map((adjustment, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {adjustment.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {adjustment.fromQuantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {adjustment.toQuantity}
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        adjustment.toQuantity > adjustment.fromQuantity 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {adjustment.toQuantity > adjustment.fromQuantity ? '+' : ''}
                        {adjustment.toQuantity - adjustment.fromQuantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {adjustment.reason}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {adjustment.user}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(adjustment.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && adjustingProduct && (
        <StockAdjustmentModal
          product={adjustingProduct}
          onAdjust={handleStockAdjustment}
          onClose={() => {
            setShowAdjustModal(false);
            setAdjustingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function StockAdjustmentModal({ 
  product, 
  onAdjust, 
  onClose 
}: { 
  product: Product; 
  onAdjust: (newQuantity: number, reason: string) => void; 
  onClose: () => void;
}) {
  const [newQuantity, setNewQuantity] = useState(product.stock_quantity || 0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onAdjust(newQuantity, reason);
  };

  const change = newQuantity - (product.stock_quantity || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-border bg-surface-primary">
          <h2 className="text-2xl font-bold text-text-primary">Adjust Stock</h2>
          <p className="text-sm text-text-secondary mt-1">
            {product.name}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Current Stock
            </label>
            <div className="px-4 py-3 bg-surface-secondary rounded-xl text-text-primary">
              {product.stock_quantity || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              New Stock *
            </label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Change
            </label>
            <div className={`px-4 py-3 rounded-xl font-medium ${
              change > 0 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : change < 0 
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-surface-secondary text-text-secondary'
            }`}>
              {change > 0 ? '+' : ''}{change}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select a reason...</option>
              <option value="Sale">Sale</option>
              <option value="Restock">Restock</option>
              <option value="Damage">Damage</option>
              <option value="Loss">Loss</option>
              <option value="Adjustment">Manual Adjustment</option>
              <option value="Return">Return</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </form>
        <div className="p-6 border-t border-border bg-surface-secondary flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-border text-text-secondary rounded-xl font-medium hover:bg-surface-primary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all shadow-sm"
          >
            Adjust Stock
          </button>
        </div>
      </div>
    </div>
  );
}
