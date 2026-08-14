import { useState } from 'react';
import { Product, Category, CartItem } from '../../types';

interface PremiumPOSProps {
  products: Product[];
  categories: Category[];
}

export default function PremiumPOS({ products, categories }: PremiumPOSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price_cents * item.quantity), 0);
  const tax = cart.reduce((sum, item) => sum + (item.product.tax_rate_cents * item.quantity), 0);
  const total = subtotal + tax;

  return (
    <div className="flex gap-6 h-full">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="mb-6">
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

        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id!)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const stock = product.stock_quantity || 0;
              const isOutOfStock = stock <= 0;
              return (
                <button
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product)}
                  disabled={isOutOfStock}
                  className={`glass rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg ${
                    isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500 cursor-pointer'
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-surface-secondary to-surface-primary rounded-xl mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-surface-primary rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-500">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1 truncate">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-500 mb-2">
                    ${(product.price_cents / 100).toFixed(2)}
                  </p>
                  <div className={`text-xs font-medium ${
                    isOutOfStock 
                      ? 'text-red-500' 
                      : stock < 10 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                  }`}>
                    {isOutOfStock ? 'Out of Stock' : `${stock} in stock`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 glass rounded-2xl flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-text-secondary">Cart is empty</p>
              <p className="text-sm text-text-secondary mt-1">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="glass-strong rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-surface-secondary to-surface-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary-500">
                      {item.product.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{item.product.name}</p>
                    <p className="text-sm text-text-secondary">
                      ${(item.product.price_cents / 100).toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="font-semibold text-text-primary">
                      ${((item.product.price_cents * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id!)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-6 border-t border-border bg-surface-secondary rounded-b-2xl">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium text-text-primary">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tax</span>
              <span className="font-medium text-text-primary">${(tax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span className="text-text-primary">Total</span>
              <span className="text-primary-500">${(total / 100).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="flex-1 py-3 border border-border text-text-secondary rounded-xl font-medium hover:bg-surface-primary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Clear
            </button>
            <button
              disabled={cart.length === 0}
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 disabled:bg-surface-secondary disabled:text-text-secondary disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
