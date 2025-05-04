import { useState, useEffect } from 'react';
import { members } from '../data/members';

const AttendanceForm = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMember, setSelectedMember] = useState('');
  const [status, setStatus] = useState('');
  const [attendanceData, setAttendanceData] = useState(() => {
    const stored = localStorage.getItem('attendance');
    return stored ? JSON.parse(stored) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember || !status) return;

    const newEntry = { date, member: selectedMember, status };
    const updatedData = [...attendanceData, newEntry];
    setAttendanceData(updatedData);
    localStorage.setItem('attendance', JSON.stringify(updatedData));

    // Reset
    setSelectedMember('');
    setStatus('');
  };

  return (
    <div>
      <h2>Form Absensi</h2>
      <form onSubmit={handleSubmit}>
        <label>Tanggal:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <label>Nama:
          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
            <option value="">-- Pilih --</option>
            {members.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- Pilih --</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Tanpa Keterangan">Tanpa Keterangan</option>
          </select>
        </label>
        <br />
        <button type="submit">Simpan</button>
      </form>

      <h3>Data Hari Ini</h3>
      <ul>
        {attendanceData
          .filter((item) => item.date === date)
          .map((item, index) => (
            <li key={index}>{item.member} - {item.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceForm;
