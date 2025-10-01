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
// 

import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      text: newTask,
      time: new Date().toLocaleString(),
    };

    // simpan di state React (biar tetap tampil di list)
    setTasks([...tasks, task]);
    setNewTask("");

    // 🔥 Tambahan: kirim juga ke Google Sheet lewat Apps Script
    fetch("https://script.google.com/macros/s/AKfycbzqHZc-cpKl-jlyTjYXIrGPWKEYgVC5w06OrfqKvlg3v7zVow0DbAMx2hTj23nspR4/exec", {
      method: "POST",
      body: JSON.stringify(task),
    })
      .then((res) => res.text())
      .then((msg) => console.log("✅ Google Sheet response:", msg))
      .catch((err) => console.error("❌ Gagal kirim ke GSheet:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Daily Activity Tracker</h1>

      <input
        type="text"
        placeholder="Tulis aktivitas..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={addTask} style={{ padding: "8px" }}>
        Tambah
      </button>

      <ul style={{ marginTop: "20px" }}>
        {tasks.map((task, idx) => (
          <li key={idx}>
            {task.text} <em>({task.time})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
