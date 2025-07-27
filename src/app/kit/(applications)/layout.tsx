import React  from "react";
import Sidebar from "./Sidebar";


export default function KitLayout({ children }: { children: React.ReactNode }) {
  // Track which categories are open


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90">
      {/* Sidebar */}
     <Sidebar />
      {/* Main Content */}
      <main className="flex-1 w-full ml-auto">{children}</main>
    </div>
  );
}