// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import { useState } from "react";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  const handleLogin = (name) => {
    setUser({ name, role: "admin", division: "Warehouse" });
  };

  const handleLogout = () => {
    setUser(null);
    setActivities([]);
  };

  const addActivity = (activity) => {
    setActivities([...activities, { id: Date.now(), ...activity }]);
  };

  const updateActivity = (id, updated) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard
          user={user}
          activities={activities}
          onAdd={addActivity}
          onUpdate={updateActivity}
          onDelete={deleteActivity}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

// -------------------- Login --------------------
function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onLogin(name);
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Daily Activity Tracker
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Masukkan nama"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

// -------------------- Dashboard --------------------
function Dashboard({ user, activities, onAdd, onUpdate, onDelete, onLogout }) {
  return (
    <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-800">
          Daily Activity Tracker
        </h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <p className="mb-6 text-gray-600">
        {user.name} — {user.division}, {user.role}
      </p>

      {/* Form */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tambah Aktivitas
      </h2>
      <ActivityForm onAdd={onAdd} />

      {/* Summary */}
      <Summary activities={activities} />

      {/* Activity List */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Daftar Aktivitas
      </h2>
      <ActivityList
        activities={activities}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}

// -------------------- Activity Form --------------------
function ActivityForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState("Belum mulai");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAdd({ title, desc, start, end, status });
    setTitle("");
    setDesc("");
    setStart("");
    setEnd("");
    setStatus("Belum mulai");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-6"
    >
      <input
        type="text"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <textarea
        placeholder="Deskripsi"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      >
        <option>Belum mulai</option>
        <option>On-going</option>
        <option>Selesai</option>
      </select>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
      >
        Tambah
      </button>
    </form>
  );
}

// -------------------- Summary --------------------
function Summary({ activities }) {
  const belum = activities.filter((a) => a.status === "Belum mulai").length;
  const ongoing = activities.filter((a) => a.status === "On-going").length;
  const selesai = activities.filter((a) => a.status === "Selesai").length;

  return (
    <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2 text-indigo-700">Ringkasan (Total)</h3>
      <div className="flex gap-4">
        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">
          Belum mulai: {belum}
        </span>
        <span className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm">
          On-going: {ongoing}
        </span>
        <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm">
          Selesai: {selesai}
        </span>
      </div>
    </div>
  );
}

// -------------------- Activity List --------------------
function ActivityList({ activities, onUpdate, onDelete }) {
  if (activities.length === 0) {
    return <p className="text-gray-500">Belum ada aktivitas.</p>;
  }

  return (
    <ul className="space-y-3">
      {activities.map((a) => (
        <ActivityItem
          key={a.id}
          activity={a}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

// -------------------- Activity Item --------------------
function ActivityItem({ activity, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(activity);

  const handleSave = () => {
    onUpdate(activity.id, form);
    setIsEditing(false);
  };

  return (
    <li className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm">
      {isEditing ? (
        <div className="flex-1 space-y-2 w-full">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <textarea
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="time"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option>Belum mulai</option>
            <option>On-going</option>
            <option>Selesai</option>
          </select>
        </div>
      ) : (
        <div>
          <h4 className="font-bold">{activity.title}</h4>
          <p className="text-sm text-gray-600">{activity.desc}</p>
          <p className="text-xs text-gray-500">
            {activity.start} - {activity.end}
          </p>
          <span
            className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
              activity.status === "Belum mulai"
                ? "bg-gray-200 text-gray-700"
                : activity.status === "On-going"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {activity.status}
          </span>
        </div>
      )}

      <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Hapus
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default App;
