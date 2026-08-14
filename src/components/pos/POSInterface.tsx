import { useState } from 'react';
import { Product, CartItem, Category, Transaction } from '@/types';
import ProductCard from './ProductCard';
import CheckoutModal from './CheckoutModal';

interface POSInterfaceProps {
  products: Product[];
  categories: Category[];
  discountsEnabled?: boolean;
}

export default function POSInterface({ products, categories, discountsEnabled = false }: POSInterfaceProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price_cents * item.quantity), 0);
  const tax = cart.reduce((sum, item) => sum + (item.product.tax_rate_cents * item.quantity), 0);
  const discount = discountAmount * 100; // Convert to cents
  const total = Math.max(0, subtotal + tax - discount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const handleCompleteTransaction = (_transaction: Transaction) => {
    setShowCheckout(false);
    setCart([]);
    setDiscountAmount(0);
  };

  return (
    <div className="flex h-full">
      {/* Product Catalog */}
      <div className="flex-1 flex flex-col">
        {/* Search and Categories */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === null
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id || null)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                stock={product.stock_quantity || 0}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{cart.length} items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🛒</div>
              <p>Cart is empty</p>
              <p className="text-sm mt-1">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${(item.product.price_cents / 100).toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ${((item.product.price_cents * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id!)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-medium">${(tax / 100).toFixed(2)}</span>
            </div>
            {discountsEnabled && (
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600 dark:text-gray-400">Discount</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -${(discount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCart([]);
                setDiscountAmount(0);
              }}
              disabled={cart.length === 0}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        total={total}
        onComplete={handleCompleteTransaction}
      />
    </div>
  );
}
