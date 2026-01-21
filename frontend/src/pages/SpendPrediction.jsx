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
import "./SpendPrediction.css";

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
      <div className="spend-prediction-page">
        {/* Header */}
        <div className="sp-header">
          <h1 className="sp-title">
            Customer Spend Predictions
          </h1>
          <p className="sp-subtitle">
            Using Decision Tree analysis on past purchase behavior
          </p>
        </div>

        {loading ? (
          <div className="sp-loading">
            <div>Loading predictions...</div>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <div className="sp-overview-grid">
              {/* Pie Chart */}
              <div className="sp-chart-col card-premium sp-card-padded">
                <div className="mb-4">
                  <h2 className="sp-card-title">
                    Top 6 Customers
                  </h2>
                  <p className="sp-card-subtitle">
                    Your biggest spenders at a glance
                  </p>
                </div>
                <div className="sp-chart-container">
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
              <div className="sp-stats-col">
                <div className="card-premium sp-card-padded">
                  <p className="sp-stat-label">Total Expected Revenue</p>
                  <p className="sp-stat-value">
                    ${totalPredictedSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="sp-stat-desc">From all customers combined</p>
                </div>

                <div className="card-premium sp-card-padded">
                  <p className="sp-stat-label">Total Customers</p>
                  <p className="sp-stat-value">{data.length}</p>
                  <p className="sp-stat-desc">Active in your base</p>
                </div>

                <div className="card-premium sp-card-padded">
                  <p className="sp-stat-label">Average per Customer</p>
                  <p className="sp-stat-value">
                    ${(totalPredictedSpend / data.length).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="sp-stat-desc">Typical spend amount</p>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <div className="sp-list-header">
              <h2 className="sp-card-title">
                All Customers
              </h2>
              <p className="sp-card-subtitle">
                Sorted by expected spending, highest first
              </p>
            </div>

            <div className="sp-list-grid">
              {paginatedData.map((item, idx) => {
                const spendLevel = item.predicted_spend >= highThreshold ? "High value" :
                  item.predicted_spend >= mediumThreshold ? "Medium" : "Low";

                const badgeClass = item.predicted_spend >= highThreshold ? "sp-badge-high" :
                  item.predicted_spend >= mediumThreshold ? "sp-badge-med" :
                    "sp-badge-low";

                const barColorClass = item.predicted_spend >= highThreshold ? "bar-indigo" :
                  item.predicted_spend >= mediumThreshold ? "bar-blue" : "bar-gray";

                return (
                  <div
                    key={idx}
                    className="card-premium sp-customer-card"
                  >
                    <div className="sp-customer-header">
                      <span className="sp-customer-label">
                        Customer
                      </span>
                      <span className={`sp-badge ${badgeClass}`}>
                        {spendLevel}
                      </span>
                    </div>

                    <p className="sp-id-text">{item.CustomerID}</p>

                    <div className="sp-spend-block">
                      <p className="sp-spend-label">
                        Expected to spend
                      </p>
                      <p className="sp-spend-amount">
                        ${item.predicted_spend.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="sp-progress-bg">
                      <div
                        className={`sp-progress-fill ${barColorClass}`}
                        style={{ width: `${(item.predicted_spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="sp-pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="sp-btn-nav"
              >
                Previous
              </button>

              <div className="sp-pages-group">
                {getPagination().map((p, idx) =>
                  p === "..." ? (
                    <span key={idx} className="sp-page-ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`sp-page-btn ${currentPage === p ? "active" : "inactive"}`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="sp-btn-nav"
              >
                Next
              </button>
            </div>

            <div className="sp-page-info">
              Page {currentPage} of {totalPages}
            </div>

            {/* API Response Preview */}
            <div className="sp-api-preview card-premium">
              <div className="mb-3">
                <h2 className="sp-card-title">
                  API Response Data
                </h2>
                <p className="sp-card-subtitle">
                  Raw JSON data from the prediction model
                </p>
              </div>
              <div className="sp-code-box">
                <pre className="sp-code">
                  {JSON.stringify(data.slice(0, 5), null, 2)}
                </pre>
              </div>
              <p className="sp-stat-desc">
                Showing first 5 records • Total: {data.length} customers
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}