import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  stock?: number;
}

export default function ProductCard({ product, onAddToCart, stock = 0 }: ProductCardProps) {
  const isOutOfStock = stock <= 0;
  
  return (
    <button
      onClick={() => !isOutOfStock && onAddToCart(product)}
      disabled={isOutOfStock}
      className={`bg-white dark:bg-gray-800 rounded-lg border p-4 transition-all text-left group
        ${isOutOfStock 
          ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md'
        }`}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        <span className="text-4xl group-hover:scale-110 transition-transform">Box</span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">{product.name}</h3>
      <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">
        ${(product.price_cents / 100).toFixed(2)}
      </p>
      <div className="flex items-center justify-between">
        {product.sku && (
          <p className="text-xs text-gray-400 dark:text-gray-500">SKU: {product.sku}</p>
        )}
        <div className={`text-xs font-medium ${
          isOutOfStock 
            ? 'text-red-500' 
            : stock < 10 
              ? 'text-yellow-600 dark:text-yellow-400' 
              : 'text-green-600 dark:text-green-400'
        }`}>
          {isOutOfStock ? 'Out of Stock' : `${stock} in stock`}
        </div>
      </div>
    </button>
  );
}
