// src/pages/Admin/AdminUsers.jsx

import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import CharAvatar from "../../components/Cards/CharAvatar";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const AdminUsers = () => {
  // This hook ensures only logged-in users can see this page
  useUserAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  // Function to fetch all users from the admin endpoint
  const fetchAllUsers = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS); // Assuming you add this path
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users. You might not be an admin.");
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the user deletion
  const handleDeleteUser = async () => {
    if (!openDeleteAlert.data) return;

    try {
      await axiosInstance.delete(
        API_PATHS.ADMIN.DELETE_USER(openDeleteAlert.data)
      );
      toast.success("User deleted successfully!");
      // Close the modal
      setOpenDeleteAlert({ show: false, data: null });
      // Refresh the user list
      fetchAllUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Failed to delete user:", error);
    }
  };

  // Fetch the data when the component loads
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="card my-5">
        <h5 className="text-lg font-semibold mb-6">Manage Users</h5>

        {/* User Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  User
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3"
                  >
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <CharAvatar fullName={user.fullName} />
                    )}
                    <div>
                      <p>{user.fullName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() =>
                        setOpenDeleteAlert({ show: true, data: user._id })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete User"
      >
        <DeleteAlert
          content="Are you sure you want to delete this user? All of their income and expense data will also be permanently deleted."
          onDelete={handleDeleteUser}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default AdminUsers;
