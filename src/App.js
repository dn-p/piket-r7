import { useState } from 'react';
import './App.css'; 

const TASKS = ['Nyapu 1', 'Nyapu 2', 'Cuci Piring', 'Ngepel'];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

// =========================================================
// PENTING: TENTUKAN TANGGAL HARI SENIN JADWAL INI DIMULAI!
// Format: 'YYYY-MM-DD' (Tahun-Bulan-Tanggal)
// Contoh di bawah: Jadwal dimulai pada Senin, 4 Mei 2026
// =========================================================
const START_DATE = new Date('2026-05-04T00:00:00'); 

// Data awal (Posisi pada minggu pertama / START_DATE)
const INITIAL_GROUPS = [
  ['Aldi', 'Yoga', 'Ihwan', 'Reza', 'Saskia'],  // Kelompok 0 (Mulai di Nyapu 1)
  ['Suci', 'Dita', 'Adit', 'Dani', 'Sari'],	// Kelompok 1 (Mulai di Nyapu 2)
  ['Agus', 'Relli', 'Angel', 'Arbie', 'Aidil'],	// Kelompok 2 (Mulai di Cuci Piring)
  ['Arif', 'Genta', 'Bobby', 'Nana', 'Rivai'],	// Kelompok 3 (Mulai di Ngepel)	
];

// Fungsi mencari tanggal Hari Senin dari tanggal tertentu
const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setHours(0, 0, 0, 0) && d.setDate(diff));
};

function App() {
  // State otomatis disetel ke Hari Senin di minggu SAAT INI (dunia nyata)
  const [baseDate, setBaseDate] = useState(getMondayOf(new Date()));

  // Menghitung SELISIH MINGGU antara minggu yang sedang dilihat dengan TANGGAL MULAI
  // Ini yang membuat rotasi berjalan otomatis tanpa harus klik tombol!
  const diffInMs = baseDate.getTime() - START_DATE.getTime();
  const absoluteWeekOffset = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

  // Navigasi manual untuk melihat-lihat
  const nextWeek = () => {
    const next = new Date(baseDate);
    next.setDate(baseDate.getDate() + 7);
    setBaseDate(next);
  };
  
  const prevWeek = () => {
    const prev = new Date(baseDate);
    prev.setDate(baseDate.getDate() - 7);
    setBaseDate(prev);
  };

  // Menghitung tanggal Senin - Jumat untuk dirender
  const currentWeekDates = DAYS.map((_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);
    return date;
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const getMonthYear = (date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Jadwal Piket Kantor </h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <button onClick={prevWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          ⬅️ Minggu Sebelumnya
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            {getMonthYear(currentWeekDates[0])}
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {absoluteWeekOffset === 0 ? "Minggu Ini" : 
            absoluteWeekOffset > 0 ? `+${absoluteWeekOffset} Minggu` : 
            `${absoluteWeekOffset} Minggu`}
          </p>
        </div>
        <button onClick={nextWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Minggu Depan ➡️
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Tugas</th>
              {DAYS.map((day, index) => (
                <th key={day} style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>
                  <div style={{ fontSize: '16px' }}>{day}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'normal', marginTop: '4px' }}>
                    {formatDate(currentWeekDates[index])}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TASKS.map((task, taskIndex) => {
              // Logika rotasi menggunakan absoluteWeekOffset (otomatis sesuai tanggal dunia nyata)
              // Menghindari hasil negatif pada modulo di JavaScript
              const offset = ((absoluteWeekOffset % TASKS.length) + TASKS.length) % TASKS.length;
              const groupIndex = (taskIndex - offset + TASKS.length) % TASKS.length;
              const assignedGroup = INITIAL_GROUPS[groupIndex];

              return (
                <tr key={taskIndex}>
                  <td style={{ border: '1px solid #ccc', padding: '12px', fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                    {task}
                  </td>
                  {assignedGroup.map((person, personIndex) => (
                    <td key={personIndex} style={{ border: '1px solid #ccc', padding: '12px' }}>
                      {person}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button onClick={() => setBaseDate(getMondayOf(new Date()))} style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            🔄 Kembali ke Hari Ini
        </button>
      </div>
    </div>
  );
}

export default App;