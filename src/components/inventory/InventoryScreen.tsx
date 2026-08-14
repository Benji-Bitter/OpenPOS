import { useState } from 'react';
import { Product, Category } from '@/types';

interface InventoryScreenProps {
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

export default function InventoryScreen({ 
  products, 
  categories, 
  onUpdateProducts 
}: InventoryScreenProps) {
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
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    if (quantity < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Inventory</h1>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedCategory || 'all'}
            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Low Stock Only</span>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-500 dark:text-gray-400">
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
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {product.name}
                        </h3>
                        {product.sku && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                            SKU: {product.sku}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
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
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Stock Adjustment Log</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">From</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">To</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Reason</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAdjustments.map((adjustment, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {adjustment.productName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {adjustment.fromQuantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {adjustment.toQuantity}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${
                        adjustment.toQuantity > adjustment.fromQuantity 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {adjustment.toQuantity > adjustment.fromQuantity ? '+' : ''}
                        {adjustment.toQuantity - adjustment.fromQuantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {adjustment.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {adjustment.user}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Adjust Stock</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {product.name}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Stock
            </label>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
              {product.stock_quantity || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Stock *
            </label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Change
            </label>
            <div className={`px-4 py-2 rounded-lg font-medium ${
              change > 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : change < 0 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {change > 0 ? '+' : ''}{change}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Adjust Stock
          </button>
        </div>
      </div>
    </div>
  );
}
