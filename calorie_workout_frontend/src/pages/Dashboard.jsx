import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Dashboard shows today's summary and quick insights. */
export default function Dashboard() {
  const [summary, setSummary] = useState({ caloriesIn: 0, caloriesOut: 0, net: 0, workouts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await apiClient.get(`/api/analytics/daily?date=${today}`);
        if (res) {
          setSummary({
            caloriesIn: res.caloriesIn ?? 0,
            caloriesOut: res.caloriesOut ?? 0,
            net: (res.caloriesIn ?? 0) - (res.caloriesOut ?? 0),
            workouts: res.workouts ?? 0,
          });
        } else {
          throw new Error("No data");
        }
      } catch (_err) {
        // Fallback demo data
        setSummary({ caloriesIn: 1800, caloriesOut: 500, net: 1300, workouts: 1 });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="muted">Overview of your daily progress</p>

      <div className="grid grid-4 mt">
        <Card title="Calories In" value={`${summary.caloriesIn} kcal`} color="primary" loading={loading} />
        <Card title="Calories Out" value={`${summary.caloriesOut} kcal`} color="secondary" loading={loading} />
        <Card title="Net Calories" value={`${summary.net} kcal`} color="accent" loading={loading} />
        <Card title="Workouts" value={String(summary.workouts)} color="neutral" loading={loading} />
      </div>
    </div>
  );
}

function Card({ title, value, color = "primary", loading }) {
  return (
    <div className={`card card-${color}`}>
      <div className="card-title">{title}</div>
      <div className="card-value">{loading ? "…" : value}</div>
    </div>
  );
}
