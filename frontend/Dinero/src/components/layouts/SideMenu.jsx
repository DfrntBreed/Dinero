// src/components/layouts/SideMenu.jsx

import React, { useContext, useState } from "react"; // 👈 1. Added useState
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import {
  LuShield,
  LuLayoutDashboard,
  LuListOrdered,
  LuUser,
} from "react-icons/lu";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false); // 👈 2. Added state for the menu

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* --- 3. This section is now wrapped in a div with hover events --- */}
      <div
        className="relative"
        onMouseEnter={() => setProfileMenuOpen(true)}
        onMouseLeave={() => setProfileMenuOpen(false)}
      >
        {/* User Profile Display */}
        <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 w-full cursor-pointer">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <CharAvatar
              fullName={user?.fullName}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
          <h5 className="text-gray-950 font-medium leading-6">
            {user?.fullName || ""}
          </h5>
        </div>

        {/* --- 4. This is the new hover menu that appears --- */}
        {isProfileMenuOpen && (
          <div className="absolute top-full w-full bg-white rounded-lg shadow-lg border p-2 z-10">
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LuUser /> Profile
            </button>
          </div>
        )}
      </div>

      {/* --- Regular User Menu Items (No changes here) --- */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label ? "text-white bg-[#875cf5]" : ""
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {/* ADMIN Section (No changes here) */}
      {user?.role === "admin" && (
        <>
          <p className="text-xs uppercase text-gray-400 mt-6 mb-2 px-3">
            Admin
          </p>
          <button
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === "Admin Dashboard" ? "text-white bg-[#875cf5]" : ""
            } py-3 px-6 rounded-lg mb-1`}
            onClick={() => navigate("/admin/dashboard")}
          >
            <LuLayoutDashboard className="text-xl" />
            Dashboard
          </button>
          <button
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === "Manage Users" ? "text-white bg-[#875cf5]" : ""
            } py-3 px-6 rounded-lg mb-3`}
            onClick={() => navigate("/admin/users")}
          >
            <LuShield className="text-xl" />
            Manage Users
          </button>
          <button
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === "Manage Transactions"
                ? "text-white bg-[#875cf5]"
                : ""
            } py-3 px-6 rounded-lg mb-3`}
            onClick={() => navigate("/admin/transactions")}
          >
            <LuListOrdered className="text-xl" />
            Transactions
          </button>
        </>
      )}
    </div>
  );
};

export default SideMenu;
