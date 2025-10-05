// controllers/adminController.js

const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

// Get a list of all users
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude their passwords from the result
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a user and all their associated data
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user to be deleted
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all income records for this user
    await Income.deleteMany({ userId: userId });

    // Delete all expense records for this user
    await Expense.deleteMany({ userId: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.getAppStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalIncomeResult = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenseResult = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalIncome: totalIncomeResult[0]?.total || 0,
      totalExpense: totalExpenseResult[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all transactions from all users
exports.getAllTransactions = async (req, res) => {
  try {
    const incomes = await Income.find({})
      .populate("userId", "fullName email")
      .sort({ date: -1 });
    const expenses = await Expense.find({})
      .populate("userId", "fullName email")
      .sort({ date: -1 });

    // Add a 'type' field to each transaction
    const formattedIncomes = incomes.map((item) => ({
      ...item.toObject(),
      type: "income",
    }));
    const formattedExpenses = expenses.map((item) => ({
      ...item.toObject(),
      type: "expense",
    }));

    // Combine and sort all transactions by date
    const allTransactions = [...formattedIncomes, ...formattedExpenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a specific transaction by its ID and type
exports.deleteTransaction = async (req, res) => {
  try {
    const { id, type } = req.params;

    if (type === "income") {
      await Income.findByIdAndDelete(id);
    } else if (type === "expense") {
      await Expense.findByIdAndDelete(id);
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getChartData = async (req, res) => {
  try {
    // 1. New User Sign-ups per day (for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userSignups = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]);

    // 2. Total Income vs Expense per day (for the last 30 days)
    const incomeData = await Income.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalIncome: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const expenseData = await Expense.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // We need to merge income and expense data by date
    const transactionsByDate = {};
    incomeData.forEach((item) => {
      transactionsByDate[item._id] = {
        date: item._id,
        income: item.totalIncome,
        expense: 0,
      };
    });
    expenseData.forEach((item) => {
      if (transactionsByDate[item._id]) {
        // If a record for this date already exists (from income), just update the expense
        transactionsByDate[item._id].expense = item.totalExpense;
      } else {
        // Otherwise, create a new record with income as 0
        transactionsByDate[item._id] = {
          date: item._id,
          income: 0,
          expense: item.totalExpense,
        };
      }
    });

    const transactionChartData = Object.values(transactionsByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.json({
      userSignups,
      transactionChartData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
