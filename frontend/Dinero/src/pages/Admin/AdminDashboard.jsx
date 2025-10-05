// src/pages/Admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import InfoCard from "../../components/Cards/InfoCard";
import { LuUsers, LuWalletMinimal, LuHandCoins } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const AdminDashboard = () => {
  useUserAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null); // New state for chart data

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch both stats and chart data
        const [statsRes, chartsRes] = await Promise.all([
          axiosInstance.get(API_PATHS.ADMIN.GET_APP_STATS),
          axiosInstance.get(API_PATHS.ADMIN.GET_ADMIN_CHARTS),
        ]);
        setStats(statsRes.data);
        setChartData(chartsRes.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Admin Dashboard">
      <div className="my-5 mx-auto">
        <h5 className="text-lg font-semibold mb-6">Application Statistics</h5>
        {/* Info Cards (no change here) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<LuUsers />}
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="bg-blue-500"
            isCurrency={false}
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income (All Users)"
            value={addThousandsSeparator(stats?.totalIncome || 0)}
            color="bg-green-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense (All Users)"
            value={addThousandsSeparator(stats?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        {/* 👇 ADD THE NEW CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* New User Sign-ups Chart */}
          <div className="card">
            <h6 className="text-md font-semibold mb-4">
              New User Sign-ups (Last 30 Days)
            </h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.userSignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => moment(tick).format("MMM D")}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* App Revenue Chart */}
          <div className="card">
            <h6 className="text-md font-semibold mb-4">
              App Revenue vs. Expense (Last 30 Days)
            </h6>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.transactionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => moment(tick).format("MMM D")}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#82ca9d"
                  name="Total Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ff6961"
                  name="Total Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
