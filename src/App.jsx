import { useState } from "react";
import Layout from "./components/Layout";
import MassAttendanceForm from "./components/MassAttendanceForm";
import DashboardRekapBulanan from "./components/DashboardRekapBulanan";
import TanggalDataPage from "./components/TanggalDataPage";
import RekapBulananPage from "./components/RekapBulananPage";
import MemberManagementPage from "./pages/MemberManagementPage";

function App() {
  const [activeTab, setActiveTab] = useState("form");

  const tabs = [
    { key: "form", label: "Form Absensi" },
    { key: "tanggal", label: "Data Absensi per Tanggal" },
    // { key: "dashboard", label: "Dashboard" },
    // { key: "rekap", label: "Rekap Bulanan" },
    // { key: "members", label: "Manajemen Anggota" },
  ];

  return (
    <Layout>
      <div className="bg-white shadow-md rounded-md p-6 max-w-5xl mx-auto mt-6">
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === "form" && <MassAttendanceForm />}
          {activeTab === "dashboard" && <DashboardRekapBulanan />}
          {activeTab === "tanggal" && <TanggalDataPage />}
          {activeTab === "rekap" && <RekapBulananPage />}
          {activeTab === "members" && <MemberManagementPage />}
        </div>
      </div>
    </Layout>
  );
}

export default App;
