// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import React, { useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({
    name: "",
    department: "WH",
    position: "",
    role: "member",
  });
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");

  const departments = ["WH", "Admin", "Finance", "GA", "Sales"];

  const login = () => {
    if (!loginData.name || !loginData.position) {
      alert("Nama dan Jabatan wajib diisi!");
      return;
    }
    setCurrentUser(loginData);
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginData({ name: "", department: "WH", position: "", role: "member" });
  };

  const addActivity = () => {
    if (!newActivity) return;
    const activity = {
      id: Date.now(),
      text: newActivity,
      user: currentUser.name,
      department: currentUser.department,
      position: currentUser.position,
      role: currentUser.role,
    };
    setActivities([activity, ...activities]);
    setNewActivity("");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login / Join</h2>

          <div className="space-y-4">
            <input
              placeholder="Nama"
              value={loginData.name}
              onChange={(e) =>
                setLoginData({ ...loginData, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={loginData.department}
              onChange={(e) =>
                setLoginData({ ...loginData, department: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>

            <input
              placeholder="Jabatan"
              value={loginData.position}
              onChange={(e) =>
                setLoginData({ ...loginData, position: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={loginData.role === "manager"}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    role: e.target.checked ? "manager" : "member",
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">Login sebagai Manager</span>
            </label>

            <button
              onClick={login}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Selamat datang, {currentUser.name} ({currentUser.department})
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Form Tambah Aktivitas */}
        <div className="flex space-x-2 mb-6">
          <input
            placeholder="Tambah aktivitas..."
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addActivity}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Tambah
          </button>
        </div>

        {/* Daftar Aktivitas */}
        <h3 className="text-lg font-semibold mb-4">Daftar Aktivitas</h3>
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-4 border rounded-lg shadow-sm flex flex-col bg-gray-50"
            >
              <span className="text-gray-800">{act.text}</span>
              <span className="text-sm text-gray-500 mt-1">
                oleh {act.user} - {act.position} ({act.department})
              </span>
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
