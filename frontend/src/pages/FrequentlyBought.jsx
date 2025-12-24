import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

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
        <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
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
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold mb-2">
              Market Basket — Apriori / FP-Growth
            </h1>
            <p className="text-md text-[var(--text-muted)]">
              Frequent itemsets + association rules powered by FP-Growth
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
            <div className="card-premium">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">
                {sortedItemsets.length}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">
                Frequent Itemsets
              </div>
            </div>

            <div className="card-premium">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">
                {sortedRules.length}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">
                Association Rules
              </div>
            </div>

            <div className="card-premium">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">
                {data.meta.max_itemset_len}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">
                Max Itemset Length
              </div>
            </div>

            <div className="card-premium">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">
                {data.meta.min_support}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Min Support</div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT: Frequent Itemsets */}
            <div className="lg:col-span-1">
              <div className="card-premium p-5">
                <h2 className="font-semibold mb-1">
                  Frequent Itemsets
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Select an itemset to see its rules
                </p>

                <input
                  type="text"
                  placeholder="Search itemset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-lg text-sm mb-4 focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                />

                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {filteredItemsets.map((i, index) => {
                    const label = i.itemsets.join(", ");
                    const support = (i.support * 100).toFixed(2);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedItemset(i)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedItemset === i
                            ? "bg-[var(--accent-primary)] text-white font-medium shadow-sm"
                            : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{label}</span>
                          <span className="text-xs opacity-70 ml-2">
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
            <div className="lg:col-span-2">
              <div className="card-premium p-5">
                <h2 className="font-semibold mb-1">
                  Rules for:{" "}
                  {selectedItemset ? selectedItemset.itemsets.join(", ") : "—"}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-5">
                  {selectedRules.length} rules found
                </p>

                {selectedRules.length === 0 ? (
                  <div className="text-center py-20 text-[var(--text-muted)]">
                    <p>No rules available for this itemset</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedRules.map((rule, idx) => {
                      const lift = rule.lift.toFixed(2);
                      const confidence = (rule.confidence * 100).toFixed(1);

                      return (
                        <div
                          key={idx}
                          className="rounded-lg p-4 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-all"
                        >
                          <div className="mb-2">
                            <h3 className="font-medium text-[var(--text-main)]">
                              {rule.antecedents.join(", ")} ➜{" "}
                              {rule.consequents.join(", ")}
                            </h3>
                          </div>

                          <div className="text-sm text-[var(--text-muted)] mb-3">
                            Lift: {lift} • Confidence: {confidence}%
                          </div>

                          <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-[var(--accent-primary)] rounded-full"
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
          <div className="mt-8 card-premium p-5">
            <h3 className="font-semibold mb-1">
              API Response Preview
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Showing first 2 sorted itemsets + first 2 sorted rules
            </p>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
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
