import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="page">
      <header className="navbar navbar-expand-md navbar-light d-print-none">
        <div className="container-xl">
          <Link to="/" className="navbar-brand">
            Sistem Absensi
          </Link>
        </div>
      </header>

      <div className="page-wrapper">
        <div className="container-xl mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
