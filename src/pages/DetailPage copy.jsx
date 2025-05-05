import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";

const DetailPage = () => {
  const { id } = useParams();
  console.log("Detail ID:", id); // Harus muncul UUID valid

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [noteEdit, setNoteEdit] = useState("");
  const [attendanceEdit, setAttendanceEdit] = useState({});

  // useEffect(() => {
  //   if (!id) {
  //     console.warn("ID tidak tersedia di URL");
  //     return;
  //   }

  //   const fetchEntry = async () => {
  //     const { data, error } = await supabase
  //       .from("attendance")
  //       .select("*")
  //       .eq("id", id)
  //       .single();

  //     if (error) {
  //       console.error("Gagal mengambil data:", error);
  //     } else {
  //       setEntry(data);
  //     }
  //     setLoading(false);
  //   };

  //   fetchEntry();
  // }, [id]);

  useEffect(() => {
    if (!id) {
      console.warn('ID tidak tersedia di URL');
      setLoading(false);
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
        setNoteEdit(data.note || '');
        setAttendanceEdit(data.attendance || {});
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
      <button
        className="btn btn-sm btn-danger mb-3"
        onClick={async () => {
          const confirmDelete = window.confirm(
            "Yakin ingin menghapus entri ini?"
          );
          if (!confirmDelete) return;

          const { error } = await supabase
            .from("attendance")
            .delete()
            .eq("id", id);

          if (error) {
            alert("Gagal menghapus data.");
            console.error(error);
          } else {
            alert("Data berhasil dihapus.");
            window.location.href = "/data"; // redirect setelah hapus
          }
        }}
      >
        Hapus Entri Ini
      </button>

      <button
        className="btn btn-sm btn-warning mb-3 ms-2"
        onClick={() => setEditMode(true)}
      >
        Edit Absensi
      </button>

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

          {editMode && (
  <>
    <textarea
      className="form-control mb-3"
      rows={3}
      value={noteEdit}
      onChange={(e) => setNoteEdit(e.target.value)}
    />

    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Hadir</th>
          <th>Izin</th>
          <th>Tanpa Keterangan</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(attendanceEdit).map((name) => (
          <tr key={name}>
            <td>{name}</td>
            {['Hadir', 'Izin', 'Tanpa Keterangan'].map((status) => (
              <td key={status}>
                <input
                  type="radio"
                  name={`status-${name}`}
                  checked={attendanceEdit[name] === status}
                  onChange={() =>
                    setAttendanceEdit((prev) => ({
                      ...prev,
                      [name]: status,
                    }))
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <button
      className="btn btn-primary"
      onClick={async () => {
        const { error } = await supabase
          .from('attendance')
          .update({
            note: noteEdit,
            attendance: attendanceEdit,
          })
          .eq('id', id);

        if (error) {
          alert('Gagal mengupdate data.');
          console.error(error);
        } else {
          alert('Berhasil diupdate!');
          window.location.reload(); // refresh data
        }
      }}
    >
      Simpan Perubahan
    </button>
  </>
)}

        </>
      )}
    </Layout>
  );
};

export default DetailPage;
