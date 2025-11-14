import { ProductMatch } from '../lib/imageMatching';

interface ProductCardProps {
  product: ProductMatch;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.similarity}%
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {product.brand && (
          <p className="text-sm text-gray-500">
            Brand: {product.brand}
          </p>
        )}
      </div>
    </div>
  );
}
