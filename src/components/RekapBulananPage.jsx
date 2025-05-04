import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { members } from '../data/members';
import Layout from '../components/Layout';

const STATUS_LIST = ['Hadir', 'Izin', 'Tanpa Keterangan'];

const RekapBulananPage = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [rekap, setRekap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = async () => {
    setLoading(true);
    const [year, mon] = month.split('-');
    const lastDay = new Date(year, mon, 0).getDate();
    const startDate = `${month}-01`;
    const endDate = `${month}-${lastDay.toString().padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('attendance')
      .select()
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const result = members.reduce((acc, name) => {
      acc[name] = { Hadir: 0, Izin: 0, 'Tanpa Keterangan': 0 };
      return acc;
    }, {});

    data.forEach((record) => {
      for (const [name, status] of Object.entries(record.attendance)) {
        if (result[name] && STATUS_LIST.includes(status)) {
          result[name][status]++;
        }
      }
    });

    setRekap(result);
    setLoading(false);
  };

  return (
    <Layout>
      <h2>Rekap Kehadiran Bulanan</h2>
      <input
        type="month"
        className="form-control w-auto mb-3"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped">
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
                <td>{rekap[name]?.Hadir || 0}</td>
                <td>{rekap[name]?.Izin || 0}</td>
                <td>{rekap[name]?.['Tanpa Keterangan'] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default RekapBulananPage;
