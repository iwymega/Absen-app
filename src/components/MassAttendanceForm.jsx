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

    const filteredAttendance = Object.fromEntries(
      Object.entries(attendance).filter(([_, status]) => status !== '')
    );

    if (Object.keys(filteredAttendance).length === 0) {
      alert('Silakan isi minimal satu kehadiran.');
      return;
    }

    const payload = {
      date,
      attendance: filteredAttendance,
      note: note || null,
    };

    const { error } = await supabase
      .from('attendance')
      .upsert([payload]); // gunakan upsert supaya update kalau tanggal sudah ada

    if (error) {
      console.error(error);
      alert('Gagal menyimpan data.');
    } else {
      alert('Absensi berhasil disimpan!');
      setNote('');
      setAttendance(
        members.reduce((acc, name) => {
          acc[name] = '';
          return acc;
        }, {})
      );
    }
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
            className='form-control'
          />
        </label>

        <br /><br />
        <label>
          Catatan:
          <br />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            cols={50}
            placeholder="Contoh: Rapat koordinasi, kegiatan lapangan, dll"
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

        <button className='btn btn-primary' type="submit" style={{ marginTop: '1rem' }}>
          Simpan Absensi
        </button>
      </form>
    </div>
  );
};

export default MassAttendanceForm;
