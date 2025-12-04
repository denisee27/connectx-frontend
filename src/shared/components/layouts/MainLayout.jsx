import { Outlet, useLocation, matchPath } from "react-router-dom";
import Navbar from "../ui/Navbar";
import { FooterMain } from "../pages/FooterMain";

export const MainLayout = () => {
  const location = useLocation();

  // Daftar route dimana footer tidak boleh muncul
  const hideFooter =
    matchPath("/home/new-event", location.pathname) ||
    matchPath("/home/event/:slug", location.pathname) ||
    matchPath("/home/payment-status", location.pathname);

  return (
    <div>
      <Navbar />
      <div className="my-12">
        <Outlet />
      </div>
      {!hideFooter && (
        <div className="mt-12">
          <FooterMain />
        </div>
      )}
    </div>
  );
}; 
