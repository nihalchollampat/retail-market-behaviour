import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./Recommendations.css";

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
      <div className="recommendations-page">
        <div className="rec-container">
          {/* Header */}
          <div className="rec-header">
            <h1 className="rec-title">
              Product Similarity Search
            </h1>
            <p className="rec-subtitle">
              Using K-Nearest Neighbors algorithm
            </p>
          </div>

          {loading ? (
            <div className="rec-loading">Loading products...</div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="rec-stats">
                <div className="card-premium rec-card-padded">
                  <div className="fb-stat-value">{productList.length}</div>
                  <div className="fb-stat-label">Total Products</div>
                </div>
                <div className="card-premium rec-card-padded">
                  <div className="fb-stat-value">{similarItems.length}</div>
                  <div className="fb-stat-label">Similar Matches</div>
                </div>
              </div>

              <div className="rec-main-grid">
                {/* Left: Product List */}
                <div className="rec-list-col">
                  <div className="card-premium rec-card-padded">
                    <h2 className="rec-card-title">Products</h2>
                    <p className="rec-card-subtitle">Select one to explore</p>

                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rec-search"
                    />

                    <div className="rec-product-list">
                      {filteredProducts.map((product, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedProduct(product)}
                          className={`rec-product-btn ${selectedProduct === product ? "active" : ""}`}
                        >
                          <div className="rec-btn-content">
                            <span className="rec-product-label">{product}</span>
                            <span className="rec-product-count">{data[product].length}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Similar Products */}
                <div className="rec-details-col">
                  <div className="card-premium rec-card-padded">
                    <div className="mb-5">
                      <h2 className="rec-card-title">
                        Similar to: {selectedProduct ? `"${selectedProduct}"` : "Nothing selected"}
                      </h2>
                      <p className="rec-card-subtitle">
                        {similarItems.length > 0
                          ? `Found ${similarItems.length} similar products`
                          : "Choose a product to see recommendations"}
                      </p>
                    </div>

                    {similarItems.length === 0 ? (
                      <div className="rec-empty-state">
                        <p>No product selected yet</p>
                      </div>
                    ) : (
                      <div className="rec-matches-list">
                        {similarItems.map((item, idx) => {
                          const matchPercent = (item.similarity * 100).toFixed(0);
                          const isStrong = item.similarity >= 0.7;
                          const isMedium = item.similarity >= 0.5;

                          const cardClass = isStrong ? "strong" : "normal";
                          const pctClass = isStrong ? "strong" : isMedium ? "medium" : "weak";
                          const fillClass = isStrong ? "strong" : isMedium ? "medium" : "weak";

                          return (
                            <div
                              key={idx}
                              className={`rec-match-card ${cardClass}`}
                            >
                              <div className="rec-match-header">
                                <div className="rec-match-info">
                                  <h3 className="rec-match-title">
                                    {item.product}
                                  </h3>
                                  <div className="rec-match-metrics">
                                    <span className={`rec-match-pct ${pctClass}`}>
                                      {matchPercent}% similar
                                    </span>
                                    {isStrong && (
                                      <span className="rec-match-badge">
                                        Strong match
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="rec-progress-bg">
                                <div
                                  className={`rec-progress-fill ${fillClass}`}
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
              <div className="rec-api-preview card-premium">
                <h3 className="rec-card-title">API Response</h3>
                <p className="rec-card-subtitle">Raw data from the similarity engine</p>
                <div className="fb-code-box">
                  <pre className="rec-code">
                    {JSON.stringify(
                      Object.fromEntries(Object.entries(data).slice(0, 2)),
                      null,
                      2
                    )}
                  </pre>
                </div>
                <p className="fb-stat-desc">
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