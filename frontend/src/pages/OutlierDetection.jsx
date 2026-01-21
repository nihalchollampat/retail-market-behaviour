import DashboardLayout from "../layouts/DashboardLayout.jsx";
import "./OutlierDetection.css";

export default function OutlierDetection() {
  return (
    <DashboardLayout>
      <div className="outlier-page">
        <h1 className="outlier-title">Outlier Detection</h1>
        <p className="outlier-desc">DBSCAN anomalies will be displayed here.</p>
      </div>
    </DashboardLayout>
  );
}
