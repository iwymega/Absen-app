import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

const DetailPage = () => {
  const { date } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select()
        .eq('date', date)
        .single();

      if (!error) setData(data);
      else console.error('Gagal mengambil detail:', error);
    };

    fetchDetail();
  }, [date]);

  return (
    <Layout>
    <div style={{ padding: '2rem' }}>
      <Link to="/">← Kembali ke Dashboard</Link>
      <h2>Detail Absensi: {date}</h2>

      {data ? (
        <>
          <p><strong>Catatan:</strong> {data.note || '-'}</p>
          <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.attendance).map(([name, status]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Memuat data...</p>
      )}
    </div>
    </Layout>
  );
};

export default DetailPage;
