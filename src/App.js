import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

const TASKS = ['Nyapu 1', 'Nyapu 2', 'Cuci Piring', 'Ngepel'];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const START_DATE = new Date('2026-05-04T00:00:00'); 

// 1. UBAH DATA LIBUR JADI OBJECT AGAR ADA NAMANYA
const HOLIDAYS = [
  { date: '2026-05-01', name: 'Hari Buruh' },
  { date: '2026-05-14', name: 'Kenaikan Yesus Kristus' },
  { date: '2026-05-27', name: 'Idul Adha' },
  { date: '2026-05-28', name: 'Haul Adrian Reza' },
  { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2026-06-16', name: 'Tahun Baru Islam 1448H' },
  { date: '2026-08-17', name: 'Hari Kemerdekaan Indonesia' },
  { date: '2026-08-25', name: 'Maulid Nabi Muhammad SAW' },
];

const PEOPLE_BY_DAY = [
  ['Aldi', 'Suci', 'Agus', 'Arif'],       // 0: Senin
  ['Genta', 'Dita', 'Relli', 'Yoga'],     // 1: Selasa
  ['Ihwan', 'Hanifah', 'Angel', 'Bobby'],    // 2: Rabu
  ['Reza', 'Dani', 'Arbie', 'Nana'],      // 3: Kamis
  ['Aidil', 'Rivai', 'Saskia', 'Ayu']    // 4: Jumat
];

const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setHours(0, 0, 0, 0) && d.setDate(diff));
};

function App() {
  const [baseDate, setBaseDate] = useState(getMondayOf(new Date()));

  const diffInMs = baseDate.getTime() - START_DATE.getTime();
  const absoluteWeekOffset = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  // Menghitung jarak minggu yang sedang tampil di layar dengan kalender hari ini
  const todayMonday = getMondayOf(new Date());
  const diffFromTodayMs = baseDate.getTime() - todayMonday.getTime();


  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. SESUAIKAN FUNGSI MESIN REM AGAR MEMBACA OBJECT LIBUR
  const getPastHolidaysCount = (dayIndex, targetDate) => {
    let count = 0;
    HOLIDAYS.forEach(holiday => {
      const hDate = new Date(holiday.date); // Ambil dari property .date
      hDate.setHours(0, 0, 0, 0);
      
      const isSameDayOfWeek = hDate.getDay() === (dayIndex + 1); 
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

  // 3. CARI APAKAH ADA HARI LIBUR DI MINGGU YANG SEDANG TAMPIL
  const holidaysThisWeek = currentWeekDates.reduce((acc, date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    const foundHoliday = HOLIDAYS.find(h => h.date === dateStr);
    if (foundHoliday) {
      // Simpan data libur beserta format tanggalnya untuk di-render nanti
      acc.push({ 
        ...foundHoliday, 
        formattedDate: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }) 
      });
    }
    return acc;
  }, []);

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
                  
                  // 4. SESUAIKAN LOGIKA PENCARIAN LIBUR DI DALAM TABEL
                  const holidayItem = HOLIDAYS.find(h => h.date === dateStr);

                  if (holidayItem) {
                    return (
                      <td 
                        key={dayIndex} 
                        title={holidayItem.name} // Menambahkan tooltip saat mouse diarahkan ke sel
                        style={{ border: '1px solid #ccc', padding: '12px', backgroundColor: '#ffebee', color: '#d32f2f', fontWeight: 'bold', cursor: 'help' }}
                      >
                      LIBUR
                      </td>
                    );
                  }

                  const pastHolidaysCount = getPastHolidaysCount(dayIndex, cellDate);
                  const effectiveOffset = absoluteWeekOffset - pastHolidaysCount;

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

      {/* 5. TAMPILKAN KETERANGAN LIBUR (HANYA JIKA ADA LIBUR DI MINGGU INI) */}
      {holidaysThisWeek.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3e0', borderLeft: '5px solid #ff9800', borderRadius: '4px', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#e65100' }}>ℹ️ Keterangan Libur:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#e65100' }}>
            {holidaysThisWeek.map((holiday, idx) => (
              <li key={idx}>
                <strong>{holiday.formattedDate}:</strong> {holiday.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => setBaseDate(getMondayOf(new Date()))} style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Kembali ke Hari Ini
        </button>
      </div>
      <Analytics />
    </div>
  );
}

export default App;