import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const TanggalDataPage = () => {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [month]);

  const fetchEntries = async () => {
    setLoading(true);
    const [year, mon] = month.split("-");
    const lastDay = new Date(year, mon, 0).getDate();
    const startDate = `${month}-01`;
    const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("attendance")
      .select("id, date, note, created_at")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching:", error);
      setLoading(false);
      return;
    }

    setEntries(data);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Semua Entri Absensi</h2>

        <div className="mb-6">
          <label htmlFor="month" className="block font-medium mb-1">
            Pilih Bulan:
          </label>
          <input
            type="month"
            id="month"
            className="border px-3 py-2 rounded-md w-full sm:w-auto"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data untuk bulan ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border-b">Tanggal</th>
                  <th className="px-4 py-2 text-left border-b">Catatan</th>
                  <th className="px-4 py-2 text-left border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="even:bg-gray-50">
                    <td className="px-4 py-2 border-b">{entry.date}</td>
                    <td className="px-4 py-2 border-b">{entry.note || "-"}</td>
                    <td className="px-4 py-2 border-b">
                      <Link
                        to={`/detail/${entry.id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TanggalDataPage;
