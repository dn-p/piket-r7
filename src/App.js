import { useState } from 'react';
import './App.css';

const TASKS = ['Nyapu 1', 'Nyapu 2', 'Cuci Piring', 'Ngepel'];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const START_DATE = new Date('2026-05-04T00:00:00'); 
const HOLIDAYS = [
  '2026-05-01', // Hari Buruh
  '2026-05-14', // Kenaikan Yesus Kristus
  '2026-06-01', // Hari Lahir Pancasila
];

// DATA DIROBAH JADI PER-HARI (KOLOM) AGAR ROTASI BISA INDEPENDEN
// Urutan ke bawah: Nyapu 1, Nyapu 2, Cuci Piring, Ngepel
const PEOPLE_BY_DAY = [
  ['Aldi', 'Suci', 'Agus', 'Arif'],       // 0: Senin
  ['Genta', 'Dita', 'Relli', 'Yoga'],     // 1: Selasa
  ['Ihwan', 'Adit', 'Angel', 'Bobby'],    // 2: Rabu
  ['Reza', 'Dani', 'Arbie', 'Nana'],      // 3: Kamis
  ['Saskia', 'Sari', 'Aidil', 'Rivai']    // 4: Jumat
];

const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setHours(0, 0, 0, 0) && d.setDate(diff));
};

function App() {
  const [baseDate, setBaseDate] = useState(getMondayOf(new Date()));

  // Menghitung putaran minggu dunia nyata
  const diffInMs = baseDate.getTime() - START_DATE.getTime();
  const absoluteWeekOffset = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

  // Helper untuk format tanggal
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // MESIN REM: Menghitung berapa kali hari ini libur di masa lalu
  const getPastHolidaysCount = (dayIndex, targetDate) => {
    let count = 0;
    HOLIDAYS.forEach(holidayStr => {
      const hDate = new Date(holidayStr);
      hDate.setHours(0, 0, 0, 0);
      
      const isSameDayOfWeek = hDate.getDay() === (dayIndex + 1); 
      // Jika liburnya terjadi SEBELUM tanggal yang sedang dilihat, tambah rem-nya
      if (isSameDayOfWeek && hDate >= START_DATE && hDate < targetDate) {
        count++;
      }
    });
    return count;
  };

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
      <h1 style={{ textAlign: 'center' }}>Jadwal Piket Kantor</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <button onClick={prevWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Minggu Sebelumnya
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
          Minggu Depan
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
            {TASKS.map((task, taskIndex) => (
              <tr key={taskIndex}>
                <td style={{ border: '1px solid #ccc', padding: '12px', fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                  {task}
                </td>
                
                {DAYS.map((_, dayIndex) => {
                  const cellDate = currentWeekDates[dayIndex];
                  const dateStr = formatDateToYYYYMMDD(cellDate);
                  const isHoliday = HOLIDAYS.includes(dateStr);

                  // JIKA HARI INI LIBUR, TAMPILKAN UI LIBUR
                  if (isHoliday) {
                    return (
                      <td key={dayIndex} style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#ffebee', color: '#d32f2f', fontWeight: 'bold' }}>
                        LIBUR
                      </td>
                    );
                  }

                  // JIKA TIDAK LIBUR, KALKULASI SIAPA YANG BERTUGAS
                  const pastHolidaysCount = getPastHolidaysCount(dayIndex, cellDate);
                  
                  // Rotasi melambat sebanyak jumlah libur yang terjadi di hari tersebut
                  const effectiveOffset = absoluteWeekOffset - pastHolidaysCount;

                  // Cari index orang yang bertugas (tahan angka agar tidak minus)
                  let personIndex = (taskIndex - effectiveOffset) % TASKS.length;
                  if (personIndex < 0) personIndex += TASKS.length; 

                  const assignedPerson = PEOPLE_BY_DAY[dayIndex][personIndex];

                  return (
                    <td key={dayIndex} style={{ border: '1px solid #ccc', padding: '12px' }}>
                      {assignedPerson}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button onClick={() => setBaseDate(getMondayOf(new Date()))} style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Kembali ke Hari Ini
        </button>
      </div>
    </div>
  );
}

export default App;