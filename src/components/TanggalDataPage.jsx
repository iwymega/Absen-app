import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const TanggalDataPage = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [month]);

  const fetchEntries = async () => {
    setLoading(true);
    const [year, mon] = month.split('-');
    const lastDay = new Date(year, mon, 0).getDate();
    const startDate = `${month}-01`;
    const endDate = `${month}-${lastDay.toString().padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('attendance')
      .select('id, date, note, created_at')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching:', error);
      setLoading(false);
      return;
    }

    setEntries(data);
    setLoading(false);
  };

  return (
    <Layout>
      <h2>Semua Entri Absensi</h2>

      <div className="mb-3">
        <label htmlFor="month">Pilih Bulan:</label>
        <input
          type="month"
          id="month"
          className="form-control w-auto d-inline-block ms-2"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : entries.length === 0 ? (
        <p className="text-muted">Belum ada data untuk bulan ini.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.note || '-'}</td>
                  <td>
                    <Link to={`/detail/${entry.id}`} className="btn btn-sm btn-outline-primary">
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default TanggalDataPage;
