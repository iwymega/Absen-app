import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const TanggalDataPage = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [tanggalList, setTanggalList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDates();
  }, [month]);

  const fetchDates = async () => {
    setLoading(true);
    const [year, mon] = month.split('-');
    const lastDay = new Date(year, mon, 0).getDate();
    const startDate = `${month}-01`;
    const endDate = `${month}-${lastDay.toString().padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('attendance')
      .select('date')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const uniqueDates = [...new Set(data.map((d) => d.date))].sort();
    setTanggalList(uniqueDates);
    setLoading(false);
  };

  return (
    <Layout>
      <h2>Data Absensi per Tanggal</h2>
      <input
        type="month"
        className="form-control w-auto mb-3"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      {loading ? (
        <p>Memuat data...</p>
      ) : tanggalList.length === 0 ? (
        <p className="text-muted">Belum ada data untuk bulan ini.</p>
      ) : (
        <ul className="list-group">
          {tanggalList.map((tgl) => (
            <li className="list-group-item" key={tgl}>
              <Link to={`/detail/${tgl}`}>{tgl}</Link>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
};

export default TanggalDataPage;
