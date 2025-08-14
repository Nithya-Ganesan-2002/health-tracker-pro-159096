import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Goals page to set daily calories, workouts per week, and target weight/date. */
export default function Goals() {
  const [form, setForm] = useState({
    dailyCalories: "",
    weeklyWorkouts: "",
    weightTarget: "",
    startWeight: "",
    targetDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/users/me/goal");
      setForm({
        dailyCalories: res?.dailyCalories ?? "",
        weeklyWorkouts: res?.weeklyWorkouts ?? "",
        weightTarget: res?.weightTarget ?? "",
        startWeight: res?.startWeight ?? "",
        targetDate: res?.targetDate ? String(res.targetDate).slice(0, 10) : "",
      });
    } catch (_err) {
      // leave defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        dailyCalories: form.dailyCalories ? Number(form.dailyCalories) : 0,
        weeklyWorkouts: form.weeklyWorkouts ? Number(form.weeklyWorkouts) : 0,
        weightTarget: form.weightTarget ? Number(form.weightTarget) : undefined,
        startWeight: form.startWeight ? Number(form.startWeight) : undefined,
        targetDate: form.targetDate || undefined,
      };
      await apiClient.put("/api/users/me/goal", payload);
      setMessage("Goal saved!");
    } catch (_err) {
      setMessage("Failed to save goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Goals</h2>
      <p className="muted">Set your targets to stay motivated</p>

      <form className="form card mt" onSubmit={onSubmit}>
        <div className="grid grid-3 gap">
          <div>
            <label>Daily calories (kcal)</label>
            <input type="number" name="dailyCalories" value={form.dailyCalories} onChange={onChange} placeholder="2000" />
          </div>
          <div>
            <label>Weekly workouts</label>
            <input type="number" name="weeklyWorkouts" value={form.weeklyWorkouts} onChange={onChange} placeholder="3" />
          </div>
          <div>
            <label>Target weight (kg)</label>
            <input type="number" name="weightTarget" value={form.weightTarget} onChange={onChange} placeholder="65" />
          </div>
        </div>

        <div className="grid grid-2 gap">
          <div>
            <label>Start weight (kg)</label>
            <input type="number" name="startWeight" value={form.startWeight} onChange={onChange} placeholder="70" />
          </div>
          <div>
            <label>Target date</label>
            <input type="date" name="targetDate" value={form.targetDate} onChange={onChange} />
          </div>
        </div>

        <div className="mt">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save goal"}</button>
        </div>

        {message && <div className="mt">{message}</div>}
      </form>

      {loading && <p>Loading…</p>}
    </div>
  );
}
