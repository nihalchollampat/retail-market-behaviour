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
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-3 rounded-lg shadow-lg">
          <p className="font-bold text-[var(--accent-primary)] mb-1">Customer #{dataPoint.customer_id}</p>
          <div className="space-y-1 text-xs text-[var(--text-muted)]">
            <p>Total Spend: <span className="font-semibold text-[var(--text-main)]">${dataPoint.total_spend}</span></p>
            <p>Orders: <span className="font-semibold text-[var(--text-main)]">{dataPoint.total_orders}</span></p>
            <p>Items: <span className="font-semibold text-[var(--text-main)]">{dataPoint.total_items}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Customer Behavior Map
          </h1>
          <p className="text-[var(--text-muted)] mb-1">
            Visualizing customer similarities using PCA (Principal Component Analysis).
          </p>
          <p className="text-sm text-[var(--text-muted)] opacity-80">
            Customers closer together exhibit similar purchasing behaviors
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[var(--text-muted)]">Loading visualization...</div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card-premium">
                <p className="text-sm text-[var(--text-muted)] mb-1">Explained Variance (PC1)</p>
                <p className="text-3xl font-bold text-[var(--accent-primary)]">
                  {(data?.explained_variance[0] * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Primary behavior factor</p>
              </div>
              <div className="card-premium">
                <p className="text-sm text-[var(--text-muted)] mb-1">Explained Variance (PC2)</p>
                <p className="text-3xl font-bold text-[var(--accent-primary)]">
                  {(data?.explained_variance[1] * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Secondary behavior factor</p>
              </div>
              <div className="card-premium">
                <p className="text-sm text-[var(--text-muted)] mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-[var(--accent-primary)]">
                  {data?.data.length}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Analyzed in 2D space</p>
              </div>
            </div>

            {/* Scatter Chart */}
            <div className="card-premium mb-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Behavioral Clusters
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  2D projection of multidimensional purchase data
                </p>
              </div>

              <div className="h-[500px] w-full">
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
            <div className="card-premium">
              <div className="mb-3">
                <h2 className="text-lg font-semibold mb-1">
                  API Response Data
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Raw JSON output from PCA analysis
                </p>
              </div>
              <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 overflow-x-auto max-h-96">
                <pre className="text-sm text-green-400 font-mono">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Showing explained variance and projected coordinates
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
