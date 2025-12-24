import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

export default function SimilarProductsDashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await API.allSimilarProducts();
        setData(res);
        if (Object.keys(res).length > 0) {
          setSelectedProduct(Object.keys(res)[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const productList = Object.keys(data);
  const filteredProducts = productList.filter(product =>
    product.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const similarItems = selectedProduct ? data[selectedProduct] : [];

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold mb-2">
              Product Similarity Search
            </h1>
            <p className="text-md text-[var(--text-muted)]">
              Using K-Nearest Neighbors algorithm
            </p>
          </div>

          {loading ? (
            <div className="text-[var(--text-muted)] text-center py-20">Loading products...</div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
                <div className="card-premium">
                  <div className="text-2xl font-bold text-[var(--accent-primary)]">{productList.length}</div>
                  <div className="text-sm text-[var(--text-muted)] mt-1">Total Products</div>
                </div>
                <div className="card-premium">
                  <div className="text-2xl font-bold text-[var(--accent-primary)]">{similarItems.length}</div>
                  <div className="text-sm text-[var(--text-muted)] mt-1">Similar Matches</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Product List */}
                <div className="lg:col-span-1">
                  <div className="card-premium p-5">
                    <h2 className="font-semibold mb-1">Products</h2>
                    <p className="text-sm text-[var(--text-muted)] mb-4">Select one to explore</p>

                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-lg text-sm mb-4 focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                    />

                    <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                      {filteredProducts.map((product, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedProduct(product)}
                          className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${selectedProduct === product
                              ? "bg-[var(--accent-primary)] text-white font-medium shadow-sm"
                              : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{product}</span>
                            <span className="text-xs opacity-70 ml-2">{data[product].length}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Similar Products */}
                <div className="lg:col-span-2">
                  <div className="card-premium p-5">
                    <div className="mb-5">
                      <h2 className="font-semibold mb-1">
                        Similar to: {selectedProduct ? `"${selectedProduct}"` : "Nothing selected"}
                      </h2>
                      <p className="text-sm text-[var(--text-muted)]">
                        {similarItems.length > 0
                          ? `Found ${similarItems.length} similar products`
                          : "Choose a product to see recommendations"}
                      </p>
                    </div>

                    {similarItems.length === 0 ? (
                      <div className="text-center py-20 text-[var(--text-muted)]">
                        <p>No product selected yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {similarItems.map((item, idx) => {
                          const matchPercent = (item.similarity * 100).toFixed(0);
                          const isStrong = item.similarity >= 0.7;
                          const isMedium = item.similarity >= 0.5;

                          return (
                            <div
                              key={idx}
                              className={`rounded-lg p-4 border transition-all ${isStrong
                                  ? "bg-[var(--bg-secondary)] border-indigo-500/30"
                                  : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]"
                                }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 pr-3">
                                  <h3 className="font-medium text-[var(--text-main)] mb-1">
                                    {item.product}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${isStrong ? "text-indigo-400" : isMedium ? "text-blue-400" : "text-[var(--text-muted)]"
                                      }`}>
                                      {matchPercent}% similar
                                    </span>
                                    {isStrong && (
                                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                                        Strong match
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all ${isStrong ? "bg-indigo-500" : isMedium ? "bg-blue-400" : "bg-gray-600"
                                    }`}
                                  style={{ width: `${matchPercent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* API Data Preview */}
              <div className="mt-8 card-premium p-5">
                <h3 className="font-semibold mb-1">API Response</h3>
                <p className="text-sm text-[var(--text-muted)] mb-3">Raw data from the similarity engine</p>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    {JSON.stringify(
                      Object.fromEntries(Object.entries(data).slice(0, 2)),
                      null,
                      2
                    )}
                  </pre>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Showing first 2 products • {productList.length} total in database
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}