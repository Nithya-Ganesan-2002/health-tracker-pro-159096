import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/** Profile page allows updating personal details. */
export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    heightCm: "",
    weightKg: "",
    gender: "other",
    activityLevel: "moderate",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/users/me");
      setForm({
        name: res?.name || "",
        age: res?.age || "",
        heightCm: res?.heightCm || "",
        weightKg: res?.weightKg || "",
        gender: res?.gender || "other",
        activityLevel: res?.activityLevel || "moderate",
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
        ...form,
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      };
      await apiClient.put("/api/users/me", payload);
      setMessage("Profile updated!");
    } catch (_err) {
      setMessage("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Profile</h2>
      <p className="muted">Keep your personal info up to date</p>

      <form className="form card mt" onSubmit={onSubmit}>
        <div className="grid grid-3 gap">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" />
          </div>
          <div>
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={onChange} placeholder="30" />
          </div>
          <div>
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-3 gap">
          <div>
            <label>Height (cm)</label>
            <input type="number" name="heightCm" value={form.heightCm} onChange={onChange} placeholder="170" />
          </div>
          <div>
            <label>Weight (kg)</label>
            <input type="number" name="weightKg" value={form.weightKg} onChange={onChange} placeholder="70" />
          </div>
          <div>
            <label>Activity level</label>
            <select name="activityLevel" value={form.activityLevel} onChange={onChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
        </div>

        <div className="mt">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </div>

        {message && <div className="mt">{message}</div>}
      </form>
      {loading && <p>Loading…</p>}
    </div>
  );
}
