import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./FrequentlyBought.css";

export default function AprioriDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemset, setSelectedItemset] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.apriori();
        setData(res);

        // Default select the top-support itemset
        if (res?.frequent_itemsets?.length > 0) {
          const sorted = [...res.frequent_itemsets].sort(
            (a, b) => b.support - a.support
          );
          setSelectedItemset(sorted[0]);
        }
      } catch (err) {
        console.error("Apriori API Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <DashboardLayout>
        <div className="fb-loading">
          Loading Apriori Market Basket Analysis…
        </div>
      </DashboardLayout>
    );

  // Raw API data
  const itemsets = data?.frequent_itemsets || [];
  const rules = data?.rules || [];

  // ---- SORTING LOGIC (FRONTEND) ----
  const sortedItemsets = [...itemsets].sort((a, b) => b.support - a.support);
  const sortedRules = [...rules].sort((a, b) => b.lift - a.lift);
  // ----------------------------------

  // Filter itemsets by search
  const filteredItemsets = sortedItemsets.filter((i) =>
    i.itemsets.join(", ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rules where the selected itemset is the antecedent
  const selectedRules = selectedItemset
    ? sortedRules.filter(
      (r) =>
        JSON.stringify(r.antecedents) ===
        JSON.stringify(selectedItemset.itemsets)
    )
    : [];

  return (
    <DashboardLayout>
      <div className="frequently-bought-page">
        <div className="fb-container">
          {/* Header */}
          <div className="fb-header">
            <h1 className="fb-title">
              Market Basket — Apriori / FP-Growth
            </h1>
            <p className="fb-subtitle">
              Frequent itemsets + association rules powered by FP-Growth
            </p>
          </div>

          {/* Stats Row */}
          <div className="fb-stats-grid">
            <div className="card-premium fb-card-padded">
              <div className="fb-stat-value">
                {sortedItemsets.length}
              </div>
              <div className="fb-stat-label">
                Frequent Itemsets
              </div>
            </div>

            <div className="card-premium fb-card-padded">
              <div className="fb-stat-value">
                {sortedRules.length}
              </div>
              <div className="fb-stat-label">
                Association Rules
              </div>
            </div>

            <div className="card-premium fb-card-padded">
              <div className="fb-stat-value">
                {data.meta.max_itemset_len}
              </div>
              <div className="fb-stat-label">
                Max Itemset Length
              </div>
            </div>

            <div className="card-premium fb-card-padded">
              <div className="fb-stat-value">
                {data.meta.min_support}
              </div>
              <div className="fb-stat-label">Min Support</div>
            </div>
          </div>

          {/* Content */}
          <div className="fb-main-grid">
            {/* LEFT: Frequent Itemsets */}
            <div className="fb-left-col">
              <div className="card-premium fb-card-padded">
                <h2 className="fb-card-title">
                  Frequent Itemsets
                </h2>
                <p className="fb-card-subtitle">
                  Select an itemset to see its rules
                </p>

                <input
                  type="text"
                  placeholder="Search itemset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="fb-search-input"
                />

                <div className="fb-item-list">
                  {filteredItemsets.map((i, index) => {
                    const label = i.itemsets.join(", ");
                    const support = (i.support * 100).toFixed(2);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedItemset(i)}
                        className={`fb-item-btn ${selectedItemset === i ? "active" : ""}`}
                      >
                        <div className="fb-btn-content">
                          <span className="fb-item-label">{label}</span>
                          <span className="fb-item-val">
                            {support}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Rules */}
            <div className="fb-right-col">
              <div className="card-premium fb-card-padded">
                <h2 className="fb-card-title">
                  Rules for:{" "}
                  {selectedItemset ? selectedItemset.itemsets.join(", ") : "—"}
                </h2>
                <p className="fb-card-subtitle">
                  {selectedRules.length} rules found
                </p>

                {selectedRules.length === 0 ? (
                  <div className="fb-empty-rules">
                    <p>No rules available for this itemset</p>
                  </div>
                ) : (
                  <div className="fb-rules-container">
                    {selectedRules.map((rule, idx) => {
                      const lift = rule.lift.toFixed(2);
                      const confidence = (rule.confidence * 100).toFixed(1);

                      return (
                        <div
                          key={idx}
                          className="fb-rule-card"
                        >
                          <div className="fb-rule-header">
                            <h3 className="fb-rule-title">
                              {rule.antecedents.join(", ")} ➜{" "}
                              {rule.consequents.join(", ")}
                            </h3>
                          </div>

                          <div className="fb-rule-stats">
                            Lift: {lift} • Confidence: {confidence}%
                          </div>

                          <div className="fb-progress-bg">
                            <div
                              className="fb-progress-fill"
                              style={{ width: `${confidence}%` }}
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

          {/* API Preview */}
          <div className="fb-api-preview card-premium">
            <h3 className="fb-card-title">
              API Response Preview
            </h3>
            <p className="fb-card-subtitle">
              Showing first 2 sorted itemsets + first 2 sorted rules
            </p>

            <div className="fb-code-box">
              <pre className="fb-code">
                {JSON.stringify(
                  {
                    itemsets: sortedItemsets.slice(0, 2),
                    rules: sortedRules.slice(0, 2),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
