// routes/adminRoutes.js

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAppStats,
  getAllTransactions,
  deleteTransaction,
  getChartData,
} = require("../controllers/adminController");
const router = express.Router();

// This route is protected by BOTH middlewares
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.get("/stats", protect, isAdmin, getAppStats);
router.get("/transactions", protect, isAdmin, getAllTransactions);
router.delete("/transactions/:type/:id", protect, isAdmin, deleteTransaction);
router.get("/charts", protect, isAdmin, getChartData);

module.exports = router;
