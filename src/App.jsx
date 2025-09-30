// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import React, { useState } from "react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    status: "Belum mulai",
  });
  const [activities, setActivities] = useState([]);

  // --- Login Form State ---
  const [formLogin, setFormLogin] = useState({
    name: "",
    department: "WH",
    position: "",
    isManager: false,
  });

  // --- Handle Login ---
  const handleLogin = () => {
    if (!formLogin.name || !formLogin.position) {
      alert("Nama dan jabatan harus diisi!");
      return;
    }
    setCurrentUser({
      name: formLogin.name,
      department: formLogin.department,
      position: formLogin.position,
      role: formLogin.isManager ? "manager" : "member",
    });
  };

  // --- Handle Logout ---
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- Add Activity ---
  const addActivity = () => {
    if (!newActivity.title) {
      alert("Judul harus diisi");
      return;
    }
    setActivities([...activities, newActivity]);
    setNewActivity({
      title: "",
      description: "",
      start: "",
      end: "",
      status: "Belum mulai",
    });
  };

  // --- Summary ---
  const countByStatus = (status) =>
    activities.filter((a) => a.status === status).length;

  // --- LOGIN PAGE ---
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login / Join
          </h2>

          {/* Nama */}
          <input
            placeholder="Nama"
            value={formLogin.name}
            onChange={(e) =>
              setFormLogin({ ...formLogin, name: e.target.value })
            }
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Department */}
          <select
            value={formLogin.department}
            onChange={(e) =>
              setFormLogin({ ...formLogin, department: e.target.value })
            }
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="WH">WH</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
          </select>

          {/* Jabatan */}
          <input
            placeholder="Jabatan"
            value={formLogin.position}
            onChange={(e) =>
              setFormLogin({ ...formLogin, position: e.target.value })
            }
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Checkbox Manager */}
          <label className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              checked={formLogin.isManager}
              onChange={(e) =>
                setFormLogin({ ...formLogin, isManager: e.target.checked })
              }
            />
            <span className="text-gray-700">Login sebagai Manager</span>
          </label>

          {/* Tombol Login */}
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PAGE ---
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Daily Activity Tracker</h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-700">
            {currentUser.name} — {currentUser.department},{" "}
            {currentUser.position} ({currentUser.role})
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Form Tambah Aktivitas */}
        <h2 className="text-lg font-semibold mb-4">Tambah Aktivitas</h2>
        <div className="space-y-4 mb-6">
          <input
            placeholder="Judul"
            value={newActivity.title}
            onChange={(e) =>
              setNewActivity({ ...newActivity, title: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Deskripsi"
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity({ ...newActivity, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newActivity.start}
            onChange={(e) =>
              setNewActivity({ ...newActivity, start: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newActivity.end}
            onChange={(e) =>
              setNewActivity({ ...newActivity, end: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newActivity.status}
            onChange={(e) =>
              setNewActivity({ ...newActivity, status: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>Belum mulai</option>
            <option>On-going</option>
            <option>Selesai</option>
          </select>
        </div>
        <button
          onClick={addActivity}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tambah
        </button>

        {/* Ringkasan */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Ringkasan (Total):</h3>
          <p className="text-gray-700">
            Belum mulai: {countByStatus("Belum mulai")} | On-going:{" "}
            {countByStatus("On-going")} | Selesai: {countByStatus("Selesai")}
          </p>
        </div>

        {/* Daftar Aktivitas */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Daftar Aktivitas:</h3>
          {activities.length === 0 ? (
            <p className="text-gray-500">Belum ada aktivitas.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((a, i) => (
                <li
                  key={i}
                  className="p-4 border rounded-lg bg-gray-50 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-gray-600">{a.description}</p>
                    <p className="text-sm text-gray-500">
                      {a.start} - {a.end}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
