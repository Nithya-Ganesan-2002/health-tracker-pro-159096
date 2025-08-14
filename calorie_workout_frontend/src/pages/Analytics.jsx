import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Analytics page visualizes progress over time. */
export default function Analytics() {
  const today = new Date();
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 3600 * 1000);
  const [from, setFrom] = useState(sevenDaysAgo.toISOString().slice(0, 10));
  const [to, setTo] = useState(today.toISOString().slice(0, 10));
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/analytics/progress?from=${from}&to=${to}`);
      setSeries(Array.isArray(res?.points) ? res.points : Array.isArray(res) ? res : []);
    } catch (_err) {
      // Fallback demo series
      const demo = Array.from({ length: 7 }).map((_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 3600 * 1000).toISOString().slice(0, 10),
        value: 1000 + i * 50 + (i % 2 ? 100 : -30),
      }));
      setSeries(demo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const stats = useMemo(() => {
    const values = series.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / (values.length || 1));
    return { min, max, avg };
  }, [series]);

  return (
    <div>
      <h2 className="page-title">Analytics</h2>
      <p className="muted">Your progress over time</p>

      <div className="card mt">
        <div className="grid grid-4 gap">
          <div>
            <label>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="align-end">
            <button className="btn btn-secondary mt-24" onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="chart mt">
          <LineChart data={series} />
        </div>

        <div className="grid grid-3 mt">
          <Metric title="Min" value={stats.min} />
          <Metric title="Max" value={stats.max} />
          <Metric title="Average" value={stats.avg} />
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{Number.isFinite(value) ? value : "–"}</div>
    </div>
  );
}

function LineChart({ data }) {
  const width = 700;
  const height = 220;
  const padding = 30;

  if (!data || data.length === 0) {
    return <div className="muted">No data available.</div>;
  }

  const values = data.map(d => d.value);
  const dates = data.map(d => d.date);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padding + (i * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - ((v - min) * (height - padding * 2)) / range;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Progress chart" className="svg-chart">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
      {/* Path */}
      <polyline fill="none" stroke="var(--color-primary)" strokeWidth="3" points={points} />
      {/* Dots */}
      {values.map((v, i) => {
        const x = padding + (i * (width - padding * 2)) / (values.length - 1);
        const y = height - padding - ((v - min) * (height - padding * 2)) / range;
        return <circle key={i} cx={x} cy={y} r="4" fill="var(--color-accent)" />;
      })}
      {/* Labels */}
      {dates.map((d, i) => {
        const x = padding + (i * (width - padding * 2)) / (values.length - 1);
        return <text key={d} x={x} y={height - 8} fontSize="10" textAnchor="middle" fill="var(--muted)">{d.slice(5)}</text>;
      })}
    </svg>
  );
}
