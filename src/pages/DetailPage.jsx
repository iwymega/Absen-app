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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/data"
          className="text-blue-600 hover:underline text-sm inline-block mb-4"
        >
          ← Kembali ke Data
        </Link>

        {loading ? (
          <p className="text-gray-500">Memuat detail...</p>
        ) : !entry ? (
          <p className="text-red-500">Data tidak ditemukan.</p>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-500"
                onClick={() => setEditMode(true)}
              >
                Edit Absensi
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                onClick={handleDelete}
              >
                Hapus Entri Ini
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-2">Detail Absensi</h2>
            <p className="mb-1">
              <span className="font-semibold">Tanggal:</span> {entry.date}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Catatan:</span>{" "}
              {entry.note || "-"}
            </p>

            {!editMode ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left border">Nama</th>
                      <th className="px-4 py-2 text-left border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(entry.attendance).map(([name, status]) => (
                      <tr key={name} className="even:bg-gray-50">
                        <td className="px-4 py-2 border">{name}</td>
                        <td className="px-4 py-2 border">{status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full border rounded-md p-2 mb-4"
                  rows={3}
                  value={noteEdit}
                  onChange={(e) => setNoteEdit(e.target.value)}
                />

                <div className="overflow-x-auto mb-4">
                  <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border text-left">Nama</th>
                        {STATUS_OPTIONS.map((s) => (
                          <th key={s} className="px-2 py-2 border">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(attendanceEdit).map((name) => (
                        <tr key={name} className="even:bg-gray-50">
                          <td className="px-4 py-2 border">{name}</td>
                          {STATUS_OPTIONS.map((status) => (
                            <td key={status} className="px-2 py-2 border text-center">
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

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={handleUpdate}
                >
                  Simpan Perubahan
                </button>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DetailPage;
