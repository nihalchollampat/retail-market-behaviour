import { useEffect, useState } from "react";
import { API } from "../services/api";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./BehaviorMap.css";

export default function BehaviorMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.customerBehavior();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Indigo theme colors for scatter points
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bm-tooltip">
          <p className="bm-tooltip-title">Customer #{dataPoint.customer_id}</p>
          <div className="bm-tooltip-content">
            <p>Total Spend: <span className="bm-tooltip-val">${dataPoint.total_spend}</span></p>
            <p>Orders: <span className="bm-tooltip-val">{dataPoint.total_orders}</span></p>
            <p>Items: <span className="bm-tooltip-val">{dataPoint.total_items}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="behavior-map-page">
        {/* Header */}
        <div className="bm-header">
          <h1 className="bm-title">
            Customer Behavior Map
          </h1>
          <p className="bm-subtitle">
            Visualizing customer similarities using PCA (Principal Component Analysis).
          </p>
          <p className="bm-desc">
            Customers closer together exhibit similar purchasing behaviors
          </p>
        </div>

        {loading ? (
          <div className="bm-loading">
            <div>Loading visualization...</div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="bm-stats-grid">
              <div className="card-premium bm-stat-card">
                <p className="bm-stat-label">Explained Variance (PC1)</p>
                <p className="bm-stat-value">
                  {(data?.explained_variance[0] * 100).toFixed(1)}%
                </p>
                <p className="bm-stat-desc">Primary behavior factor</p>
              </div>
              <div className="card-premium bm-stat-card">
                <p className="bm-stat-label">Explained Variance (PC2)</p>
                <p className="bm-stat-value">
                  {(data?.explained_variance[1] * 100).toFixed(1)}%
                </p>
                <p className="bm-stat-desc">Secondary behavior factor</p>
              </div>
              <div className="card-premium bm-stat-card">
                <p className="bm-stat-label">Total Customers</p>
                <p className="bm-stat-value">
                  {data?.data.length}
                </p>
                <p className="bm-stat-desc">Analyzed in 2D space</p>
              </div>
            </div>

            {/* Scatter Chart */}
            <div className="card-premium bm-chart-card">
              <div className="bm-chart-header">
                <h2 className="bm-chart-title">
                  Behavioral Clusters
                </h2>
                <p className="bm-chart-subtitle">
                  2D projection of multidimensional purchase data
                </p>
              </div>

              <div className="bm-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="PC1"
                      tick={{ fill: '#a1a1aa', fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-subtle)' }}
                      label={{ value: 'Principal Component 1', position: 'bottom', offset: 0, fill: '#a1a1aa', fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="PC2"
                      tick={{ fill: '#a1a1aa', fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-subtle)' }}
                      label={{ value: 'Principal Component 2', angle: -90, position: 'left', fill: '#a1a1aa', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--text-muted)' }} />
                    <Scatter name="Customers" data={data?.data} fill="#6366f1">
                      {data?.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* API Response Preview */}
            <div className="card-premium bm-api-preview">
              <div className="mb-3">
                <h2 className="bm-chart-title">
                  API Response Data
                </h2>
                <p className="bm-chart-subtitle">
                  Raw JSON output from PCA analysis
                </p>
              </div>
              <div className="bm-code-box">
                <pre className="bm-code">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              <p className="bm-stat-desc">
                Showing explained variance and projected coordinates
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
