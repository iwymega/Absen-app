import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";

const DetailPage = () => {
  const { id } = useParams();
  console.log("Detail ID:", id); // Harus muncul UUID valid

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.warn('ID tidak tersedia di URL');
      return;
    }
  
    const fetchEntry = async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) {
        console.error('Gagal mengambil data:', error);
      } else {
        setEntry(data);
      }
      setLoading(false);
    };
  
    fetchEntry();
  }, [id]);
  

//   useEffect(() => {
//     const fetchEntry = async () => {
//       const { data, error } = await supabase
//         .from("attendance")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Gagal mengambil data:", error);
//       } else {
//         setEntry(data);
//       }
//       setLoading(false);
//     };

//     fetchEntry();
//   }, [id]);

  return (
    <Layout>
      <Link to="/data" className="btn btn-sm btn-outline-secondary mb-3">
        ← Kembali
      </Link>

      {loading ? (
        <p>Memuat detail...</p>
      ) : !entry ? (
        <p className="text-danger">Data tidak ditemukan.</p>
      ) : (
        <>
          <h2>Detail Absensi</h2>
          <p>
            <strong>Tanggal:</strong> {entry.date}
          </p>
          <p>
            <strong>Catatan:</strong> {entry.note || "-"}
          </p>

          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(entry.attendance).map(([name, status]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DetailPage;
