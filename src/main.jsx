// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DetailPage from "./pages/DetailPage";
import RekapBulananPage from "./components/RekapBulananPage";
import TanggalDataPage from "./components/TanggalDataPage";
import MemberManagementPage from "./pages/MemberManagementPage";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/detail/:id", element: <DetailPage /> },
  { path: "/dashboard", element: <RekapBulananPage /> },
  { path: "/data", element: <TanggalDataPage /> },
  { path: '/members', element: <MemberManagementPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
