import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Close icon for the sidebar
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, setOpen}) => {
  const location = useLocation(); // Get current location (URL)

  useEffect(()=>{
    setOpen(false);
  },[location]);

  return (
    <>
      {/* Sidebar as an overlay */}
      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg z-50 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header with close button */}
        <div className="flex justify-between items-center p-4 ">
        <img src="//bigybags.com/cdn/shop/files/Bigy_Bags-logo_300x300.png?v=1649403703" alt="Biggy Bags" className="h-20 w-20 origin-center" />
          {/* <span className="text-lg font-bold">Biggy Bags</span> */}
          {/* <FaTimes size="1em" className="cursor-pointer" onClick={toggleSidebar} /> */}
        </div>

        {/* Sidebar Menu */}
        <div className="mt-[1%]"> {/* Add vertical spacing between items */}
          <NavLink
            to="/dashboard/dashboard"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/network"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Network
          </NavLink>
          <NavLink
            to="/dashboard/products"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/dashboard/ewallet"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Transaction History
          </NavLink>
          <NavLink
            to="/dashboard/payout"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Cash Withdraw
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/statements"
            className={({ isActive }) =>
              isActive
                ? "block py-3 px-4 bg-[#D0FAFF] text-black font-semibold"
                : "block py-3 px-4 text-gray-600 border-b-[1px] border-b-[#D8D8D8] hover:bg-[#001B36] hover:text-[#00E5FF] transition-colors ease-out"
            }
          >
            Statements
          </NavLink>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
