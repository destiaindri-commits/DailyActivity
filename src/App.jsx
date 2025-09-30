// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import React, { useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState({
    name: "dea",
    department: "WH",
    position: "admin",
    role: "member",
  });
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    status: "Belum mulai",
  });

  const addActivity = () => {
    if (!newActivity.title) return;
    setActivities([{ id: Date.now(), ...newActivity }, ...activities]);
    setNewActivity({ title: "", description: "", start: "", end: "", status: "Belum mulai" });
  };

  const statusCount = (status) =>
    activities.filter((a) => a.status === status).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daily Activity Tracker</h1>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
        <p className="text-gray-600 mb-8">
          {currentUser.name} — {currentUser.department}, {currentUser.position} ({currentUser.role})
        </p>

        {/* Form Tambah Aktivitas */}
        <h2 className="text-lg font-semibold mb-4">Tambah Aktivitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            placeholder="Judul"
            value={newActivity.title}
            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Deskripsi"
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newActivity.start}
            onChange={(e) => setNewActivity({ ...newActivity, start: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newActivity.end}
            onChange={(e) => setNewActivity({ ...newActivity, end: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newActivity.status}
            onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>Belum mulai</option>
            <option>On-going</option>
            <option>Selesai</option>
          </select>
        </div>
        <button
          onClick={addActivity}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tambah
        </button>

        {/* Ringkasan */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Ringkasan (Total):</h3>
          <p className="text-gray-600">
            Belum mulai: {statusCount("Belum mulai")} | On-going: {statusCount("On-going")} | Selesai: {statusCount("Selesai")}
          </p>
        </div>

        {/* Daftar Aktivitas */}
        <h2 className="text-lg font-semibold mt-8 mb-4">Daftar Aktivitas</h2>
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <h4 className="font-semibold text-gray-800">{act.title}</h4>
              <p className="text-gray-600">{act.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {act.start} - {act.end} | Status:{" "}
                <span
                  className={
                    act.status === "Selesai"
                      ? "text-green-600 font-medium"
                      : act.status === "On-going"
                      ? "text-yellow-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {act.status}
                </span>
              </p>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-gray-500">Belum ada aktivitas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
