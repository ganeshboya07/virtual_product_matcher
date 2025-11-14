import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { supabase, Product } from './lib/supabase';
import { findSimilarProducts, ProductMatch } from './lib/imageMatching';
import { ImageUpload } from './components/ImageUpload';
import { ProductCard } from './components/ProductCard';
import { FilterPanel } from './components/FilterPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError('Failed to load products. Please refresh the page.');
      console.error('Error loading products:', err);
    }
  }

  async function handleImageSelect(imageUrl: string) {
    setUploadedImage(imageUrl);
    setLoading(true);
    setError('');
    setMatches([]);

    try {
      const similarProducts = await findSimilarProducts(imageUrl, products);
      setMatches(similarProducts);
    } catch (err) {
      setError('Failed to process image. Please try another image.');
      console.error('Error finding similar products:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMatches = useMemo(() => {
    return matches.filter((product) => {
      if (product.similarity < minSimilarity) return false;
      if (selectedCategory && product.category !== selectedCategory) return false;
      return true;
    });
  }, [matches, minSimilarity, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Search className="text-blue-600" size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Visual Product Matcher
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Upload an image to find visually similar products
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Image
              </h2>
              <ImageUpload onImageSelect={handleImageSelect} disabled={loading} />

              {uploadedImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Your Image
                  </h3>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {matches.length > 0 && (
              <FilterPanel
                minSimilarity={minSimilarity}
                onMinSimilarityChange={setMinSimilarity}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {error && <ErrorMessage message={error} />}

            {loading && <LoadingSpinner />}

            {!loading && matches.length > 0 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Similar Products
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {filteredMatches.length} of {matches.length} results
                  </p>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">
                      No products match your current filters. Try adjusting the similarity threshold or category.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredMatches.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && !uploadedImage && !error && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get Started
                </h3>
                <p className="text-gray-600">
                  Upload an image or provide an image URL to find visually similar products from our catalog of {products.length} items.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Visual Product Matcher - Powered by image similarity analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
