import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

import React from "react";
import Navbar from "../ui/Navbar";

export const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="my-12">
        <Outlet />
      </div>
    </div>
  );
}; 
