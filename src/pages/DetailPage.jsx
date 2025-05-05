import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";

import { members } from "../data/members";

const STATUS_OPTIONS = ["Hadir", "Izin", "Tanpa Keterangan"];

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [noteEdit, setNoteEdit] = useState("");
  const [attendanceEdit, setAttendanceEdit] = useState({});

  // Fetch detail absensi
  useEffect(() => {
    if (!id) {
      console.warn("ID tidak tersedia di URL");
      setLoading(false);
      return;
    }

    const fetchEntry = async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setEntry(data);
        setNoteEdit(data.note || "");
        // setAttendanceEdit(data.attendance || {});

        const fullAttendance = members.reduce((acc, name) => {
          acc[name] = data.attendance?.[name] || "";
          return acc;
        }, {});
        setAttendanceEdit(fullAttendance);
      }

      setLoading(false);
    };

    fetchEntry();
  }, [id]);

  // Handler hapus
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus entri ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("attendance").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus data.");
      console.error(error);
    } else {
      alert("Data berhasil dihapus.");
      navigate("/data");
    }
  };

  // Handler update
  const handleUpdate = async () => {
    const { error } = await supabase
      .from("attendance")
      .update({
        note: noteEdit,
        attendance: attendanceEdit,
      })
      .eq("id", id);

    if (error) {
      alert("Gagal mengupdate data.");
      console.error(error);
    } else {
      alert("Berhasil diupdate!");
      setEditMode(false);
      window.location.reload();
    }
  };

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
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => setEditMode(true)}
            >
              Edit Absensi
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              Hapus Entri Ini
            </button>
          </div>

          <h2>Detail Absensi</h2>
          <p>
            <strong>Tanggal:</strong> {entry.date}
          </p>
          <p>
            <strong>Catatan:</strong> {entry.note || "-"}
          </p>

          {!editMode ? (
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
          ) : (
            <>
              <textarea
                className="form-control mb-3"
                rows={3}
                value={noteEdit}
                onChange={(e) => setNoteEdit(e.target.value)}
              />

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      {STATUS_OPTIONS.map((s) => (
                        <th key={s}>{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(attendanceEdit).map((name) => (
                      <tr key={name}>
                        <td>{name}</td>
                        {STATUS_OPTIONS.map((status) => (
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
              </div>

              <button className="btn btn-primary" onClick={handleUpdate}>
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
