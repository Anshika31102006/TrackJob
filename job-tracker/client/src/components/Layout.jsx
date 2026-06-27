import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-60">
        <Navbar />
        <div className="p-6 mt-16">{children}</div>
      </div>
    </div>
  );
}