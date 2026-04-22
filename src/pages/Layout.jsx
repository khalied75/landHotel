import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
export default function Layout() {
  return (
       <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
