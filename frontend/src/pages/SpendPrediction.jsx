import { useEffect, useState } from "react";
import { API } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const PAGE_SIZE = 12;
const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4f46e5", "#7c3aed"];

export default function SpendPredictionDashboard({ sidebarWidth = 64 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.customerSpendPrediction();
        const sorted = res.sort((a, b) => b.predicted_spend - a.predicted_spend);
        setData(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const maxSpend = Math.max(...data.map(item => item.predicted_spend), 1);
  const totalPredictedSpend = data.reduce((acc, cur) => acc + cur.predicted_spend, 0);

  // Calculate dynamic thresholds based on data distribution
  const avgSpend = totalPredictedSpend / data.length;
  const highThreshold = avgSpend * 1.5;
  const mediumThreshold = avgSpend * 0.75;

  const getPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 2 ||
        i > totalPages - 2 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        i === 3 && currentPage > 4 ||
        i === totalPages - 2 && currentPage < totalPages - 3
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Customer Spend Predictions
          </h1>
          <p className="text-md text-[var(--text-muted)]">
            Using Decision Tree analysis on past purchase behavior
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[var(--text-muted)]">Loading predictions...</div>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Pie Chart */}
              <div className="lg:col-span-2 card-premium">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">
                    Top 6 Customers
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Your biggest spenders at a glance
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.slice(0, 6)}
                        dataKey="predicted_spend"
                        nameKey="CustomerID"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(entry) => `$${entry.predicted_spend.toFixed(0)}`}
                        labelLine={true}
                      >
                        {data.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `$${value.toFixed(2)}`}
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          color: 'var(--text-main)'
                        }}
                        itemStyle={{ color: 'var(--text-main)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="card-premium">
                  <p className="text-sm text-[var(--text-muted)] mb-1">Total Expected Revenue</p>
                  <p className="text-3xl font-bold text-[var(--accent-primary)]">
                    ${totalPredictedSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">From all customers combined</p>
                </div>

                <div className="card-premium">
                  <p className="text-sm text-[var(--text-muted)] mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-[var(--accent-primary)]">{data.length}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Active in your base</p>
                </div>

                <div className="card-premium">
                  <p className="text-sm text-[var(--text-muted)] mb-1">Average per Customer</p>
                  <p className="text-3xl font-bold text-[var(--accent-primary)]">
                    ${(totalPredictedSpend / data.length).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Typical spend amount</p>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold mb-1">
                All Customers
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Sorted by expected spending, highest first
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedData.map((item, idx) => {
                const spendLevel = item.predicted_spend >= highThreshold ? "High value" :
                  item.predicted_spend >= mediumThreshold ? "Medium" : "Low";
                // Colors for badges
                const levelColor = item.predicted_spend >= highThreshold ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" :
                  item.predicted_spend >= mediumThreshold ? "text-blue-400 bg-blue-500/10 border-blue-500/30" :
                    "text-gray-400 bg-gray-500/10 border-gray-500/30";

                const barColor = item.predicted_spend >= highThreshold ? "bg-indigo-500" :
                  item.predicted_spend >= mediumThreshold ? "bg-blue-400" : "bg-gray-600";

                return (
                  <div
                    key={idx}
                    className="card-premium"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                        Customer
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-md border ${levelColor}`}>
                        {spendLevel}
                      </span>
                    </div>

                    <p className="font-semibold text-base mb-3 text-ellipsis overflow-hidden">{item.CustomerID}</p>

                    <div className="mb-3">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Expected to spend
                      </p>
                      <p className="font-bold text-xl text-[var(--text-main)]">
                        ${item.predicted_spend.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="w-full bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${barColor}`}
                        style={{ width: `${(item.predicted_spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-[var(--text-main)]"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {getPagination().map((p, idx) =>
                  p === "..." ? (
                    <span key={idx} className="px-2 py-2 text-[var(--text-muted)]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === p
                          ? "bg-[var(--accent-primary)] text-white"
                          : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-[var(--text-main)]"
              >
                Next
              </button>
            </div>

            <div className="text-center mt-3 text-sm text-[var(--text-muted)]">
              Page {currentPage} of {totalPages}
            </div>

            {/* API Response Preview */}
            <div className="mt-10 card-premium">
              <div className="mb-3">
                <h2 className="text-lg font-semibold mb-1">
                  API Response Data
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Raw JSON data from the prediction model
                </p>
              </div>
              <div className=" rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono">
                  {JSON.stringify(data.slice(0, 5), null, 2)}
                </pre>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Showing first 5 records • Total: {data.length} customers
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}