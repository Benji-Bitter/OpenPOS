import { useState } from 'react';
import { Product, Category } from '../../types';

interface PremiumProductsProps {
  products: Product[];
  categories: Category[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
}

export default function PremiumProducts({ 
  products, 
  categories, 
  onUpdateProducts,
  onUpdateCategories 
}: PremiumProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      onUpdateProducts([...products, { ...product, id: Date.now() }]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      onUpdateCategories(categories.map(c => c.id === category.id ? category : c));
    } else {
      onUpdateCategories([...categories, { ...category, id: Date.now() }]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      onUpdateCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'products'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'categories'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-primary hover:text-text-primary'
            }`}
          >
            Categories
          </button>
        </div>
        {activeTab === 'products' && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-sm"
          >
            Add Product
          </button>
        )}
        {activeTab === 'categories' && (
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-sm"
          >
            Add Category
          </button>
        )}
      </div>

      {/* Search and Filter */}
      {activeTab === 'products' && (
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
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'products' ? (
          filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
                <span className="text-4xl">Box</span>
              </div>
              <p className="text-text-secondary">
                {products.length === 0 ? 'No products yet' : 'No products match your filters'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
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
                      </div>
                      {product.description && (
                        <p className="text-sm text-text-secondary mb-3">{product.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="font-medium text-primary-500">
                          ${(product.price_cents / 100).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>Tax: {(product.tax_rate_cents / 100).toFixed(2)}%</span>
                        <span>•</span>
                        <span>Stock: {product.stock_quantity || 0}</span>
                        {product.category_id && (
                          <>
                            <span>•</span>
                            <span>{categories.find(c => c.id === product.category_id)?.name || 'Unknown'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductModal(true);
                        }}
                        className="p-2 text-text-secondary hover:text-primary-500 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => product.id && handleDeleteProduct(product.id)}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-text-secondary">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryModal(true);
                      }}
                      className="p-2 text-text-secondary hover:text-primary-500 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => category.id && handleDeleteCategory(category.id)}
                      className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ 
  product, 
  categories, 
  onSave, 
  onClose 
}: { 
  product: Product | null; 
  categories: Category[]; 
  onSave: (product: Product) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      price_cents: 0,
      category_id: undefined,
      sku: '',
      barcode: '',
      tax_rate_cents: 0,
      stock_quantity: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price_cents === undefined) return;
    
    onSave({
      ...formData,
      price_cents: formData.price_cents || 0,
      tax_rate_cents: formData.tax_rate_cents || 0,
      stock_quantity: formData.stock_quantity || 0,
      created_at: product?.created_at || Date.now(),
      updated_at: Date.now(),
    } as Product);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border bg-surface-primary">
          <h2 className="text-2xl font-bold text-text-primary">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                value={(formData.price_cents || 0) / 100}
                onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={(formData.tax_rate_cents || 0) / 100}
                onChange={(e) => setFormData({ ...formData, tax_rate_cents: Math.round(parseFloat(e.target.value) * 100) })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Barcode
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Category
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">No Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
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
            {product ? 'Update' : 'Add'} Product
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({ 
  category, 
  onSave, 
  onClose 
}: { 
  category: Category | null; 
  onSave: (category: Category) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      name: '',
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    onSave({
      ...formData,
      created_at: category?.created_at || Date.now(),
      updated_at: Date.now(),
    } as Category);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-border bg-surface-primary">
          <h2 className="text-2xl font-bold text-text-primary">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-primary border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              rows={3}
            />
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
            {category ? 'Update' : 'Add'} Category
          </button>
        </div>
      </div>
    </div>
  );
}
