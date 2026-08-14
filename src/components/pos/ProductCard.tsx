import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-left"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500 text-2xl">📦</span>
      </div>
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">${(product.price_cents / 100).toFixed(2)}</p>
      {product.sku && (
        <p className="text-xs text-gray-400 dark:text-gray-500">SKU: {product.sku}</p>
      )}
    </button>
  );
}
