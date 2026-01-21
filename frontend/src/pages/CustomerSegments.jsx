import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./CustomerSegments.css";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4f46e5", "#7c3aed"];

export default function CustomerSegments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://retail-market-behaviour.onrender.com/customer-segmentation?k=3")
      .then((res) => res.json())
      .then((data) => {
        setSegments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCustomers = segments.reduce((sum, s) => sum + s.customers, 0);
  const maxSpend = Math.max(...segments.map(s => parseFloat(s.avg_spend)), 1);

  // Mock trend data for visualization
  const trendData = [
    { month: 'Jan', c0: 65, c1: 2800, c2: 1600 },
    { month: 'Feb', c0: 58, c1: 2950, c2: 1750 },
    { month: 'Mar', c0: 72, c1: 3100, c2: 1680 },
    { month: 'Apr', c0: 68, c1: 2850, c2: 1850 },
    { month: 'May', c0: 85, c1: 3300, c2: 1950 },
    { month: 'Jun', c0: 78, c1: 3500, c2: 2100 },
  ];

  return (
    <DashboardLayout>
      <div className="customer-segments-page">
        {/* Header */}
        <div className="cs-header">
          <h1 className="cs-title">
            Customer Segmentation
          </h1>
          <p className="cs-subtitle">
            Group customers based on purchasing behavior using K-Means.
          </p>
          <p className="cs-description">
            Identify behavioral archetypes for targeted marketing
          </p>
        </div>

        {loading ? (
          <div className="cs-loading">
            <div className="cs-loading-text">Loading segments...</div>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <div className="cs-grid">
              {/* Trend Chart */}
              <div className="cs-trend-chart card-premium">
                <div className="cs-card-header">
                  <h2 className="cs-card-title">
                    Spending Trends
                  </h2>
                  <p className="cs-card-subtitle">
                    Average spending behavior over the last 6 months
                  </p>
                </div>
                <div className="cs-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          color: 'var(--text-main)'
                        }}
                        itemStyle={{ color: 'var(--text-main)' }}
                        formatter={(value) => [`$${value}`, undefined]}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="c0" name="Cluster 0" stroke={COLORS[0]} strokeWidth={3} dot={{ r: 4, fill: COLORS[0], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="c1" name="Cluster 1" stroke={COLORS[1]} strokeWidth={3} dot={{ r: 4, fill: COLORS[1], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="c2" name="Cluster 2" stroke={COLORS[2]} strokeWidth={3} dot={{ r: 4, fill: COLORS[2], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="cs-stats-column">
                <div className="cs-stat-card card-premium">
                  <p className="cs-stat-label">Total Customers</p>
                  <p className="cs-stat-value">
                    {totalCustomers.toLocaleString()}
                  </p>
                  <p className="cs-stat-desc">Across all segments</p>
                </div>

                <div className="cs-stat-card card-premium">
                  <p className="cs-stat-label">Active Clusters</p>
                  <p className="cs-stat-value">{segments.length}</p>
                  <p className="cs-stat-desc">Distinct behavioral groups</p>
                </div>

                <div className="cs-stat-card card-premium">
                  <p className="cs-stat-label">Highest Avg Spend</p>
                  <p className="cs-stat-value">
                    ${maxSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="cs-stat-desc">Per customer in top cluster</p>
                </div>
              </div>
            </div>

            {/* Cluster List */}
            <div className="cs-section-header">
              <h2 className="cs-card-title">
                Cluster Details
              </h2>
              <p className="cs-card-subtitle">
                Detailed metrics for each customer segment
              </p>
            </div>

            <div className="cs-clusters-grid">
              {segments.map((seg, idx) => {
                const spendRatio = parseFloat(seg.avg_spend) / maxSpend;
                const barColorClass = spendRatio > 0.6 ? "bg-indigo-500" : spendRatio > 0.3 ? "bg-blue-400" : "bg-gray-600";

                return (
                  <div
                    key={seg.cluster_id}
                    className="card-premium"
                  >
                    <div className="cs-cluster-header">
                      <span className="cs-cluster-label">
                        Segment
                      </span>
                      <span className="cs-cluster-badge">
                        Cluster {seg.cluster_id}
                      </span>
                    </div>

                    <div className="cs-cluster-metrics">
                      <div>
                        <p className="cs-metric-label">Avg Spend</p>
                        <p className="cs-metric-value">${parseFloat(seg.avg_spend).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="cs-metric-label">Customers</p>
                        <p className="cs-metric-value">{seg.customers}</p>
                      </div>
                      <div>
                        <p className="cs-metric-label">Avg Orders</p>
                        <p className="cs-metric-value">{parseFloat(seg.avg_orders).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="cs-metric-label">Avg Items</p>
                        <p className="cs-metric-value">{parseFloat(seg.avg_items).toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="cs-progress-bg">
                      <div
                        className={`cs-progress-bar ${barColorClass}`}
                        style={{ width: `${spendRatio * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* API Response Preview */}
            <div className="cs-api-preview card-premium">
              <div className="cs-card-header">
                <h2 className="cs-card-title">
                  API Response Data
                </h2>
                <p className="cs-card-subtitle">
                  Raw JSON data from the segmentation model
                </p>
              </div>
              <div className="cs-code-block">
                <pre className="cs-code-content">
                  {JSON.stringify(segments, null, 2)}
                </pre>
              </div>
              <p className="cs-stat-desc">
                Total: {segments.length} clusters
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
