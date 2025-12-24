import DashboardLayout from "../layouts/DashboardLayout.jsx";

export default function OutlierDetection() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Outlier Detection</h1>
        <p className="text-[var(--text-muted)]">DBSCAN anomalies will be displayed here.</p>
      </div>
    </DashboardLayout>
  );
}
