// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react` or use Create React App
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling
// Daily Activity Tracker with Google Sheet integration
// Daily Activity Tracker - Single-file React prototype
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react`
// 2. Replace App.jsx with this file's content, install dependencies (none required beyond React)
// 3. Add Tailwind CSS to project (optional) or the component will fall back to basic styling

// Daily Activity Tracker - Single-file React prototype + Google Sheet Integration
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react`
// 2. Replace App.jsx with this file's content
// 3. Install Tailwind (optional) or use default inline styles
// 4. Ganti "YOUR_GOOGLE_SCRIPT_WEB_APP_URL" dengan URL Web App dari Google Apps Script
// Daily Activity Tracker - Single-file React prototype + Google Sheet Integration
// How to run:
// 1. Create a new Vite React project: `npm create vite@latest my-app --template react`
// 2. Replace App.jsx with this file's content
// 3. Install Tailwind (optional) or use default inline styles
// 4. Ganti "YOUR_GOOGLE_SCRIPT_WEB_APP_URL" dengan URL Web App dari Google Apps Script

import React, { useState, useEffect } from "react";

// Hitung durasi aktivitas
function calcDuration(start, end) {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60; // kalau nyebrang hari
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
    setNewTask({
      title: "",
      desc: "",
      start: "",
      end: "",
      status: "Belum mulai",
      assignedTo: "",
    });

    // 🔥 Tambahan: kirim juga ke Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbzGabZ4RuFD5jl-oiRdzAGACn1oy3cabQ5uKhrP1A/dev", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((msg) => console.log("Google Sheet response:", msg))
      .catch((err) => console.error("Gagal kirim ke GSheet:", err));
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
      <div style={{ maxWidth: 400, margin: "50px auto" }}>
        <h2>Login / Join</h2>
        <input
          placeholder="Nama"
          value={loginData.name}
          onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <select
          value={loginData.department}
          onChange={(e) =>
            setLoginData({ ...loginData, department: e.target.value })
          }
          style={{ width: "100%", marginBottom: 8 }}
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
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label style={{ display: "block", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={loginData.role === "manager"}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                role: e.target.checked ? "manager" : "member",
              })
            }
          />{" "}
          Login sebagai Manager
        </label>
        <button onClick={login} style={{ width: "100%" }}>
          Masuk
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto" }}>
      <h2>Daily Activity Tracker</h2>
      <div style={{ marginBottom: 20 }}>
        {currentUser ? (
          <div>
            <strong>{currentUser.name}</strong> —{" "}
            <small>
              {currentUser.department}, {currentUser.position} (
              {currentUser.role})
            </small>
            <button onClick={logout} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </div>
        ) : (
          <em>Not logged in</em>
        )}
      </div>

      <h3>Tambah Aktivitas</h3>
      <input
        placeholder="Judul"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <textarea
        placeholder="Deskripsi"
        value={newTask.desc}
        onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
        style={{ width: "100%", marginBottom: 8, width: "100%" }}
      />
      <div style={{ marginBottom: 8 }}>
        <label>Jam mulai: </label>
        <input
          type="time"
          value={newTask.start}
          onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Jam selesai: </label>
        <input
          type="time"
          value={newTask.end}
          onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Status: </label>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option>Belum mulai</option>
          <option>On-going</option>
          <option>Selesai</option>
        </select>
      </div>
      {currentUser.role === "manager" && (
        <div style={{ marginBottom: 8 }}>
          <label>Assign ke: </label>
          <select
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
      <button onClick={addTask}>Tambah</button>

      <h3 style={{ marginTop: 30 }}>Daftar Aktivitas</h3>

      {/* Resume aktivitas global */}
      <div
        style={{
          marginBottom: 15,
          padding: 10,
          background: "#f9f9f9",
          borderRadius: 6,
          border: "1px solid #ddd",
        }}
      >
        <strong>Ringkasan (Total):</strong>
        <br />
        Belum mulai:{" "}
        {visibleTasks.filter((t) => t.status === "Belum mulai").length} | On-going:{" "}
        {visibleTasks.filter((t) => t.status === "On-going").length} | Selesai:{" "}
        {visibleTasks.filter((t) => t.status === "Selesai").length}
      </div>

      {currentUser.role === "manager" ? (
        // Manager lihat aktivitas per admin side-to-side
        <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
          {users
            .filter((u) => u.role !== "manager")
            .map((u) => {
              const userTasks = tasks.filter(
                (t) => t.createdBy === u.name || t.assignedTo === u.name
              );
              const belum = userTasks.filter((t) => t.status === "Belum mulai").length;
              const ongoing = userTasks.filter((t) => t.status === "On-going").length;
              const selesai = userTasks.filter((t) => t.status === "Selesai").length;
              const totalDurasi = sumDurations(userTasks);
              return (
                <div
                  key={u.name}
                  style={{
                    flex: "0 0 300px",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    background: "#fafafa",
                  }}
                >
                  <h4>
                    {u.name} — {u.department}, {u.position}
                  </h4>
                  <div
                    style={{
                      fontSize: 13,
                      marginBottom: 8,
                      background: "#eef",
                      padding: 6,
                      borderRadius: 4,
                    }}
                  >
                    <strong>Ringkasan:</strong> Belum mulai: {belum} | On-going:{" "}
                    {ongoing} | Selesai: {selesai} | Total: {totalDurasi}
                  </div>
                  {userTasks.length === 0 && <em>Tidak ada aktivitas</em>}
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {userTasks.map((a) => (
                      <li
                        key={a.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: 6,
                          padding: 8,
                          marginBottom: 8,
                          background: "#fff",
                        }}
                      >
                        <strong>{a.title}</strong>
                        <div style={{ fontSize: 12 }}>{a.desc}</div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          {a.start} - {a.end} ({calcDuration(a.start, a.end)})
                        </div>
                        <div>
                          <label>Status: </label>
                          <select
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
                        <button onClick={() => deleteTask(a.id)}>Hapus</button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </div>
      ) : (
        // Member lihat aktivitas pribadi
        <ul style={{ listStyle: "none", padding: 0 }}>
          {visibleTasks.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 6,
              }}
            >
              <strong>{a.title}</strong> <br />
              <small>{a.desc}</small>
              <div style={{ fontSize: 12, color: "#555" }}>
                {a.start} - {a.end} ({calcDuration(a.start, a.end)})
              </div>
              <div>
                <label>Status: </label>
                <select
                  value={a.status}
                  onChange={(e) => updateTask(a.id, "status", e.target.value)}
                >
                  <option>Belum mulai</option>
                  <option>On-going</option>
                  <option>Selesai</option>
                </select>
              </div>
              <div style={{ fontSize: 12, color: "#777" }}>
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
