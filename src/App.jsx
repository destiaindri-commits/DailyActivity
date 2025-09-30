// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import React, { useState } from "react";

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "dea",
    department: "WH",
    position: "admin",
    role: "member",
  });
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    status: "Belum mulai",
  });

  const addActivity = () => {
    if (!newActivity.title) {
      alert("Judul harus diisi");
      return;
    }
    console.log("Aktivitas ditambahkan:", newActivity);
    setNewActivity({
      title: "",
      description: "",
      start: "",
      end: "",
      status: "Belum mulai",
    });
  };

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
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
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
        <div className="mt-8 p-4 bg-gray-50 border rounded-lg">
          <h3 className="font-semibold mb-2">Ringkasan (Total):</h3>
          <p className="text-gray-700">
            Belum mulai: 0 | On-going: 0 | Selesai: 0
          </p>
        </div>
      </div>
    </div>
  );
}
