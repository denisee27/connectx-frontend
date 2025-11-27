import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

import React from "react";
import NavbarMain from "../../../features/profiling/pages/NavbarMain";

export const MainLayout = () => {
  return (
    <div>
      <NavbarMain />
      <div className="my-12">
        <Outlet />
      </div>
    </div>
  );
}; 
