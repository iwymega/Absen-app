import { useState } from 'react';
import Layout from './components/Layout';
import MassAttendanceForm from './components/MassAttendanceForm';
import DashboardRekapBulanan from './components/DashboardRekapBulanan';
import TanggalDataPage from './components/TanggalDataPage';
import RekapBulananPage from './components/RekapBulananPage';
import MemberManagementPage from './pages/MemberManagementPage';

function App() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <Layout>
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                Form Absensi
              </button>
            </li>
            {/* <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </li> */}
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'tanggal' ? 'active' : ''}`}
                onClick={() => setActiveTab('tanggal')}
              >
                Data Absensi per Tanggal
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'rekap' ? 'active' : ''}`}
                onClick={() => setActiveTab('rekap')}
              >
                Rekap Bulanan
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
                >
                Manajemen Anggota
                </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'form' && <MassAttendanceForm />}
          {activeTab === 'dashboard' && <DashboardRekapBulanan />}
          {activeTab === 'tanggal' && <TanggalDataPage />}
          {activeTab === 'rekap' && <RekapBulananPage />}
          {activeTab === 'members' && <MemberManagementPage />}
        </div>
      </div>
    </Layout>
  );
}

export default App;
