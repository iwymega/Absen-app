import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { members } from "../data/members";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const STATUS_LIST = ["Hadir", "Izin", "Tanpa Keterangan"];

const DashboardRekapBulanan = () => {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  ); // yyyy-mm
  const [rekap, setRekap] = useState({});
  const [loading, setLoading] = useState(false);
  const [tanggalList, setTanggalList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const [year, mon] = month.split("-");
    const lastDay = new Date(year, mon, 0).getDate();
    const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;
    const startDate = `${month}-01`;

    const { data, error } = await supabase
      .from("attendance")
      .select()
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      console.error("Error fetching:", error);
      setLoading(false);
      return;
    }

    // Rekap
    const result = members.reduce((acc, name) => {
      acc[name] = {
        Hadir: 0,
        Izin: 0,
        "Tanpa Keterangan": 0,
      };
      return acc;
    }, {});

    // List tanggal
    const tanggalData = [];

    data.forEach((record) => {
      tanggalData.push(record.date);

      const attendance = record.attendance;
      for (const [name, status] of Object.entries(attendance)) {
        if (result[name] && STATUS_LIST.includes(status)) {
          result[name][status]++;
        }
      }
    });

    setRekap(result);
    setTanggalList(tanggalData.sort()); // urutkan tanggal
    setLoading(false);
  };

  const fetchDataV1 = async () => {
    setLoading(true);
    const startDate = `${month}-01`;
    // const endDate = `${month}-31`; // asumsi max tanggal 31

    const [year, mon] = month.split("-");
    const lastDay = new Date(year, mon, 0).getDate(); // dapatkan hari terakhir bulan
    const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("attendance")
      .select()
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      console.error("Error fetching:", error);
      setLoading(false);
      return;
    }

    // Inisialisasi rekap kosong
    const result = members.reduce((acc, name) => {
      acc[name] = {
        Hadir: 0,
        Izin: 0,
        "Tanpa Keterangan": 0,
      };
      return acc;
    }, {});

    data.forEach((record) => {
      const attendance = record.attendance;
      for (const [name, status] of Object.entries(attendance)) {
        if (result[name] && STATUS_LIST.includes(status)) {
          result[name][status]++;
        }
      }
    });

    setRekap(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  return (
    <Layout>
      <div style={{ marginTop: "2rem" }}>
        <h2>Dashboard Rekap Bulanan</h2>

        <label>
          Pilih Bulan:
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ marginLeft: "1rem" }}
          />
        </label>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <table
            className="table table-striped"
            border="1"
            cellPadding="8"
            style={{ marginTop: "1rem" }}
          >
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
                  <td>{rekap[name]?.["Tanpa Keterangan"] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: "2rem" }}>Tanggal dengan Data</h3>
        {/* <ul>
        {tanggalList.length === 0 ? (
          <li>Tidak ada data di bulan ini.</li>
        ) : (
          tanggalList.map((tgl) => (
            <li key={tgl}>
              <Link to={`/detail/${tgl}`}>{tgl}</Link>
            </li>
          ))
        )}
      </ul> */}
        <ul className="list-group">
          {tanggalList.map((tgl) => (
            <li className="list-group-item" key={tgl}>
              <Link to={`/detail/${tgl}`}>{tgl}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default DashboardRekapBulanan;
