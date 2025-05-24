import { useState } from "react";
import { members } from "../data/members";
import { supabase } from "../lib/supabase";

const MassAttendanceForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  const [attendance, setAttendance] = useState(() =>
    members.reduce((acc, name) => {
      acc[name] = "";
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
      Object.entries(attendance).filter(([_, status]) => status !== "")
    );

    if (Object.keys(filteredAttendance).length === 0) {
      alert("Silakan isi minimal satu kehadiran.");
      return;
    }

    const payload = {
      date,
      attendance: filteredAttendance,
      note: note || null,
    };

    const { error } = await supabase.from("attendance").insert([payload]);

    if (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } else {
      alert("Absensi berhasil disimpan!");
      setNote("");
      setAttendance(
        members.reduce((acc, name) => {
          acc[name] = "";
          return acc;
        }, {})
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-6">Absensi Massal</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="md:w-1/4 font-medium">Tanggal:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-1/2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Catatan:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border rounded-md p-2"
            placeholder="Contoh: Rapat koordinasi, kegiatan lapangan, dll"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Hadir</th>
                <th className="p-2 border">Izin</th>
                <th className="p-2 border">Tanpa Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {members.map((name) => (
                <tr key={name} className="text-center even:bg-gray-50">
                  <td className="p-2 border font-medium text-left">{name}</td>
                  {["Hadir", "Izin", "Tanpa Keterangan"].map((status) => (
                    <td key={status} className="p-2 border">
                      <input
                        type="radio"
                        name={`status-${name}`}
                        value={status}
                        checked={attendance[name] === status}
                        onChange={() => handleStatusChange(name, status)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Simpan Absensi
        </button>
      </form>
    </div>
  );
};

export default MassAttendanceForm;
