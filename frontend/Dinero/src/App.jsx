import React from "react";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageTransactions from "./pages/Admin/ManageTransactions";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Dashboard/Profile";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/admin/users" exact element={<AdminUsers />} />
            <Route path="/admin/dashboard" exact element={<AdminDashboard />} />
            <Route
              path="/admin/transactions"
              exact
              element={<ManageTransactions />}
            />
            <Route path="/profile" exact element={<Profile />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className: "'",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  //Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
