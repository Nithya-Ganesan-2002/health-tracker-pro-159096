import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Foods page lets users log their meals and view recent entries. */
export default function Foods() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    name: "",
    mealType: "breakfast",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/foods");
      setItems(Array.isArray(res) ? res : []);
    } catch (_err) {
      // Fallback demo data
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
        calories: Number(form.calories || 0),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
      };
      const created = await apiClient.post("/api/foods", payload);
      setItems(prev => [created, ...prev]);
      setForm(prev => ({ ...prev, name: "", calories: "", protein: "", carbs: "", fat: "", notes: "" }));
    } catch (err) {
      setError(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Foods</h2>
      <p className="muted">Log what you ate today</p>

      <form className="form card mt" onSubmit={onSubmit}>
        <div className="grid grid-4 gap">
          <div>
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </div>
          <div>
            <label>Meal</label>
            <select name="mealType" value={form.mealType} onChange={onChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div>
            <label>Food name</label>
            <input type="text" name="name" placeholder="Chicken salad" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label>Calories</label>
            <input type="number" name="calories" placeholder="450" value={form.calories} onChange={onChange} required />
          </div>
        </div>

        <div className="grid grid-4 gap">
          <div>
            <label>Protein (g)</label>
            <input type="number" name="protein" placeholder="30" value={form.protein} onChange={onChange} />
          </div>
          <div>
            <label>Carbs (g)</label>
            <input type="number" name="carbs" placeholder="40" value={form.carbs} onChange={onChange} />
          </div>
          <div>
            <label>Fat (g)</label>
            <input type="number" name="fat" placeholder="10" value={form.fat} onChange={onChange} />
          </div>
          <div>
            <label>Notes</label>
            <input type="text" name="notes" placeholder="Optional notes" value={form.notes} onChange={onChange} />
          </div>
        </div>

        {error && <div className="alert mt">{error}</div>}
        <div className="mt">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Add Food"}</button>
        </div>
      </form>

      <div className="card mt">
        <h3>Recent entries</h3>
        {loading ? <p>Loading…</p> : items.length === 0 ? <p className="muted">No entries yet.</p> : (
          <div className="table">
            <div className="table-row table-header">
              <div>Date</div>
              <div>Meal</div>
              <div>Name</div>
              <div>Calories</div>
            </div>
            {items.map((it) => (
              <div className="table-row" key={it.id || it._id || `${it.date}-${it.name}-${Math.random()}`}>
                <div>{it.date}</div>
                <div>{it.mealType}</div>
                <div>{it.name}</div>
                <div>{it.calories}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
