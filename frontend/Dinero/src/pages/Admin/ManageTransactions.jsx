// src/pages/Admin/ManageTransactions.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const ManageTransactions = () => {
  useUserAuth();
  const [transactions, setTransactions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchAllTransactions = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_ALL_TRANSACTIONS
      );
      setTransactions(response.data);
    } catch (error) {
      toast.error("Failed to fetch transactions.");
    }
  };

  const handleDeleteTransaction = async () => {
    if (!openDeleteAlert.data) return;
    const { type, _id } = openDeleteAlert.data;
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_TRANSACTION(type, _id));
      toast.success("Transaction deleted successfully!");
      setOpenDeleteAlert({ show: false, data: null });
      fetchAllTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction.");
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Transactions">
      <div className="card my-5">
        <h5 className="text-lg font-semibold mb-6">Manage All Transactions</h5>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  User
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Source/Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {txn.userId.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{txn.userId.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${
                        txn.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{txn.source || txn.category}</td>
                  <td className="px-6 py-4 font-medium">₹{txn.amount}</td>
                  <td className="px-6 py-4">
                    {moment(txn.date).format("Do MMM YYYY")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() =>
                        setOpenDeleteAlert({ show: true, data: txn })
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
        title="Delete Transaction"
      >
        <DeleteAlert
          content="Are you sure you want to permanently delete this transaction?"
          onDelete={handleDeleteTransaction}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default ManageTransactions;
