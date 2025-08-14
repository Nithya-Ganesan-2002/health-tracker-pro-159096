import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Exercises page lets users log workouts and view recent entries. */
export default function Exercises() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "",
    durationMin: "",
    caloriesBurned: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/exercises");
      setItems(Array.isArray(res) ? res : []);
    } catch (_err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        durationMin: Number(form.durationMin || 0),
        caloriesBurned: Number(form.caloriesBurned || 0),
      };
      const created = await apiClient.post("/api/exercises", payload);
      setItems(prev => [created, ...prev]);
      setForm(prev => ({ ...prev, type: "", durationMin: "", caloriesBurned: "", notes: "" }));
    } catch (err) {
      setError(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Exercises</h2>
      <p className="muted">Log your workouts and activities</p>

      <form className="form card mt" onSubmit={onSubmit}>
        <div className="grid grid-4 gap">
          <div>
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div>
            <label>Type</label>
            <input type="text" name="type" placeholder="Running, Cycling..." value={form.type} onChange={onChange} required />
          </div>
          <div>
            <label>Duration (min)</label>
            <input type="number" name="durationMin" placeholder="30" value={form.durationMin} onChange={onChange} required />
          </div>
          <div>
            <label>Calories burned</label>
            <input type="number" name="caloriesBurned" placeholder="250" value={form.caloriesBurned} onChange={onChange} required />
          </div>
        </div>

        <div>
          <label>Notes</label>
          <input type="text" name="notes" placeholder="Optional notes" value={form.notes} onChange={onChange} />
        </div>

        {error && <div className="alert mt">{error}</div>}
        <div className="mt">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Add Exercise"}</button>
        </div>
      </form>

      <div className="card mt">
        <h3>Recent workouts</h3>
        {loading ? <p>Loading…</p> : items.length === 0 ? <p className="muted">No entries yet.</p> : (
          <div className="table">
            <div className="table-row table-header">
              <div>Date</div>
              <div>Type</div>
              <div>Duration</div>
              <div>Calories</div>
            </div>
            {items.map((it) => (
              <div className="table-row" key={it.id || it._id || `${it.date}-${it.type}-${Math.random()}`}>
                <div>{it.date}</div>
                <div>{it.type}</div>
                <div>{it.durationMin} min</div>
                <div>{it.caloriesBurned}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
