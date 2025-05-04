import { useState } from 'react';
import { members } from '../data/members';
import { supabase } from '../lib/supabase';

const MassAttendanceForm = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');

  const [attendance, setAttendance] = useState(() =>
    members.reduce((acc, name) => {
      acc[name] = ''; // status awal kosong
      return acc;
    }, {})
  );

  const handleStatusChange = (name, status) => {
    setAttendance((prev) => ({
      ...prev,
      [name]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const records = Object.entries(attendance)
      .filter(([_, status]) => status !== '')
      .map(([member, status]) => ({
        date,
        member,
        status,
        note: note || null,
      }));
  
    if (records.length === 0) {
      alert('Silakan isi minimal satu kehadiran.');
      return;
    }
  
    const { data, error } = await supabase.from('attendance').insert(records);
  
    if (error) {
      console.error(error);
      alert('Gagal menyimpan ke Supabase');
    } else {
      alert('Absensi berhasil disimpan secara online!');
      setNote('');
      setAttendance(
        members.reduce((acc, name) => {
          acc[name] = '';
          return acc;
        }, {})
      );
    }
  };
  

  const handleSubmitV1 = (e) => {
    e.preventDefault();

    const filteredAttendance = Object.fromEntries(
      Object.entries(attendance).filter(([_, status]) => status !== '')
    );

    if (Object.keys(filteredAttendance).length === 0) {
      alert('Silakan isi minimal satu kehadiran.');
      return;
    }

    const stored = localStorage.getItem('attendance');
    const prevData = stored ? JSON.parse(stored) : {};

    const updatedData = {
      ...prevData,
      [date]: {
        attendance: {
          ...(prevData[date]?.attendance || {}),
          ...filteredAttendance,
        },
        note: note || prevData[date]?.note || '',
      },
    };

    localStorage.setItem('attendance', JSON.stringify(updatedData));
    alert('Absensi dan catatan disimpan.');

    // Reset form
    setNote('');
    setAttendance(
      members.reduce((acc, name) => {
        acc[name] = '';
        return acc;
      }, {})
    );
  };

  return (
    <div>
      <h2>Absensi Massal</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tanggal:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginLeft: '1rem' }}
          />
        </label>

        <br /><br />
        <label>
          Catatan / Kegiatan:
          <br />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            cols={50}
            placeholder="Contoh: Rapat koordinasi, kegiatan outdoor, dll"
          />
        </label>

        <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Hadir</th>
              <th>Izin</th>
              <th>Tanpa Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {members.map((name) => (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  <input
                    type="radio"
                    name={`status-${name}`}
                    value="Hadir"
                    checked={attendance[name] === 'Hadir'}
                    onChange={() => handleStatusChange(name, 'Hadir')}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`status-${name}`}
                    value="Izin"
                    checked={attendance[name] === 'Izin'}
                    onChange={() => handleStatusChange(name, 'Izin')}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`status-${name}`}
                    value="Tanpa Keterangan"
                    checked={attendance[name] === 'Tanpa Keterangan'}
                    onChange={() =>
                      handleStatusChange(name, 'Tanpa Keterangan')
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Simpan Absensi & Catatan
        </button>
      </form>
    </div>
  );
};

export default MassAttendanceForm;
