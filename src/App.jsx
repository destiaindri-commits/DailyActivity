// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
import React, { useState, useEffect } from "react";

// Hitung durasi aktivitas
function calcDuration(start, end) {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}j ${m}m`;
}

// Hitung total durasi beberapa aktivitas
function sumDurations(tasks) {
  let total = 0;
  tasks.forEach((t) => {
    if (t.start && t.end) {
      const [sh, sm] = t.start.split(":").map(Number);
      const [eh, em] = t.end.split(":").map(Number);
      let diff = eh * 60 + em - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      total += diff;
    }
  });
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}j ${m}m`;
}

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const [loginData, setLoginData] = useState({
    name: "",
    department: "WH",
    position: "",
    role: "member",
  });

  const departments = ["WH", "MS1", "KR2", "KN4", "NT3", "Oven Team"];

  const login = () => {
    if (!loginData.name || !loginData.department || !loginData.position) {
      alert("Isi semua data terlebih dahulu!");
      return;
    }
    const existing = users.find(
      (u) =>
        u.name === loginData.name &&
        u.department === loginData.department &&
        u.position === loginData.position
    );
    let user;
    if (existing) {
      user = existing;
    } else {
      user = { ...loginData };
      setUsers([...users, user]);
    }
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const [newTask, setNewTask] = useState({
    title: "",
    desc: "",
    start: "",
    end: "",
    status: "Belum mulai",
    assignedTo: "",
  });

  // Fungsi kirim data ke Google Sheet
  const sendToGoogleSheet = async (task) => {
    const payload = {
      name: currentUser.name,
      department: currentUser.department,
      position: currentUser.position,
      role: currentUser.role,
      title: task.title,
      desc: task.desc,
      start: task.start,
      end: task.end,
      status: task.status,
      assignedTo: task.assignedTo,
    };

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbw7-dXjiTp6ofIaDjgKDO2wj64HmUKns_4zYvurmfsdcq4L7OJ8D1-Vg3NS19Rou5s/exec", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Google Sheet response:", data);
    } catch (err) {
      console.error("Gagal mengirim ke Google Sheet:", err);
    }
  };

  const addTask = () => {
    if (!newTask.title) {
      alert("Judul harus diisi");
      return;
    }
    const task = {
      ...newTask,
      id: Date.now(),
      createdBy: currentUser.name,
    };
    setTasks([...tasks, task]);
    sendToGoogleSheet(task);
    setNewTask({
      title: "",
      desc: "",
      start: "",
      end: "",
      status: "Belum mulai",
      assignedTo: "",
    });
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const visibleTasks =
    currentUser?.role === "manager"
      ? tasks
      : tasks.filter(
          (t) =>
            t.createdBy === currentUser?.name ||
            t.assignedTo === currentUser?.name
        );

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Login / Join</h2>
        <input
          className="w-full mb-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Nama"
          value={loginData.name}
          onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
        />
        <select
          className="w-full mb-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
          value={loginData.department}
          onChange={(e) =>
            setLoginData({ ...loginData, department: e.target.value })
          }
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
        <input
          className="w-full mb-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Jabatan"
          value={loginData.position}
          onChange={(e) =>
            setLoginData({ ...loginData, position: e.target.value })
          }
        />
        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            className="mr-2"
            checked={loginData.role === "manager"}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                role: e.target.checked ? "manager" : "member",
              })
            }
          />
          Login sebagai Manager
        </label>
        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Masuk
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Daily Activity Tracker</h2>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <strong>{currentUser.name}</strong>{" "}
          <span className="text-gray-600 text-sm">
            — {currentUser.department}, {currentUser.position} (
            {currentUser.role})
          </span>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Tambah Aktivitas */}
      <h3 className="text-xl font-semibold mb-3">Tambah Aktivitas</h3>
      <input
        className="w-full mb-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
        placeholder="Judul"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
        placeholder="Deskripsi"
        value={newTask.desc}
        onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
      />
      <div className="mb-2">
        <label className="block text-sm">Jam mulai:</label>
        <input
          type="time"
          className="border rounded-lg p-2"
          value={newTask.start}
          onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Jam selesai:</label>
        <input
          type="time"
          className="border rounded-lg p-2"
          value={newTask.end}
          onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Status:</label>
        <select
          className="border rounded-lg p-2"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option>Belum mulai</option>
          <option>On-going</option>
          <option>Selesai</option>
        </select>
      </div>
      {currentUser.role === "manager" && (
        <div className="mb-2">
          <label className="block text-sm">Assign ke:</label>
          <select
            className="border rounded-lg p-2 w-full"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
          >
            <option value="">(Pilih user)</option>
            {users.map((u) => (
              <option key={u.name} value={u.name}>
                {u.name} — {u.department}, {u.position}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={addTask}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Tambah
      </button>

      {/* Ringkasan */}
      <h3 className="text-xl font-semibold mt-8 mb-3">Daftar Aktivitas</h3>
      <div className="mb-4 p-4 bg-white rounded-lg shadow text-sm">
        <strong>Ringkasan (Total):</strong>
        <br />
        Belum mulai:{" "}
        {visibleTasks.filter((t) => t.status === "Belum mulai").length} | On-going:{" "}
        {visibleTasks.filter((t) => t.status === "On-going").length} | Selesai:{" "}
        {visibleTasks.filter((t) => t.status === "Selesai").length}
      </div>

      {/* Manager View */}
      {currentUser.role === "manager" ? (
        <div className="flex gap-4 overflow-x-auto">
          {users
            .filter((u) => u.role !== "manager")
            .map((u) => {
              const userTasks = tasks.filter(
                (t) => t.createdBy === u.name || t.assignedTo === u.name
              );
              const belum = userTasks.filter((t) => t.status === "Belum mulai")
                .length;
              const ongoing = userTasks.filter((t) => t.status === "On-going")
                .length;
              const selesai = userTasks.filter((t) => t.status === "Selesai")
                .length;
              const totalDurasi = sumDurations(userTasks);
              return (
                <div
                  key={u.name}
                  className="flex-shrink-0 w-72 border rounded-lg p-4 bg-white shadow"
                >
                  <h4 className="font-semibold mb-2">
                    {u.name} — {u.department}, {u.position}
                  </h4>
                  <div className="text-sm mb-3 p-2 bg-blue-50 rounded">
                    <strong>Ringkasan:</strong> Belum mulai: {belum} | On-going:{" "}
                    {ongoing} | Selesai: {selesai} | Total: {totalDurasi}
                  </div>
                  {userTasks.length === 0 && (
                    <em className="text-gray-500 text-sm">Tidak ada aktivitas</em>
                  )}
                  <ul className="space-y-3">
                    {userTasks.map((a) => (
                      <li
                        key={a.id}
                        className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                      >
                        <strong>{a.title}</strong>
                        <div className="text-xs text-gray-600">{a.desc}</div>
                        <div className="text-xs text-gray-500">
                          {a.start} - {a.end} ({calcDuration(a.start, a.end)})
                        </div>
                        <div className="mt-1">
                          <label className="text-xs">Status: </label>
                          <select
                            className="border rounded p-1 text-sm"
                            value={a.status}
                            onChange={(e) =>
                              updateTask(a.id, "status", e.target.value)
                            }
                          >
                            <option>Belum mulai</option>
                            <option>On-going</option>
                            <option>Selesai</option>
                          </select>
                        </div>
                        <button
                          onClick={() => deleteTask(a.id)}
                          className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleTasks.map((a) => (
            <li key={a.id} className="border p-3 rounded-lg bg-white shadow-sm">
              <strong>{a.title}</strong> <br />
              <small className="text-gray-600">{a.desc}</small>
              <div className="text-xs text-gray-500">
                {a.start} - {a.end} ({calcDuration(a.start, a.end)})
              </div>
              <div className="mt-1">
                <label className="text-xs">Status: </label>
                <select
                  className="border rounded p-1 text-sm"
                  value={a.status}
                  onChange={(e) => updateTask(a.id, "status", e.target.value)}
                >
                  <option>Belum mulai</option>
                  <option>On-going</option>
                  <option>Selesai</option>
                </select>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Dibuat oleh: {a.createdBy}
                {a.assignedTo && ` | Ditugaskan ke: ${a.assignedTo}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
