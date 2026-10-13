"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboardLayout/Sidebar";
import Header from "@/components/dashboardLayout/Header";
import AdminGuard from "@/context/AdminGuard";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AdminGuard>
    <div className="min-h-screen bg-[#111111]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`
          min-h-screen
          transition-[margin] duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        {/* Fixed Header */}
        <header className="fixed inset-x-0 top-0 lg:left-64 lg:right-0">
          <Header sidebarOpen={sidebarOpen} />
        </header>

        {/* Dashboard Content */}
        <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AdminGuard>
  );
}

// "use client";

// import Sidebar from "@/components/dashboardLayout/Sidebar";
// import Header from "../../components/dashboardLayout/Header";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-5 z-50 h-screen w-64">
//         <Sidebar />
//       </aside>

//       {/* Main Area */}
//       <div className="ml-64">
//         {/* Header */}
//         <header className="fixed left-64 right-0 top-0 z-40 h-16">
//           <Header />
//         </header>

//         {/* Content */}
//         <main className="pt-16">
//           <div className="mx-auto w-full max-w-7xl px-9 py-6">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
