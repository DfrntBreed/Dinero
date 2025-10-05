// middleware/adminMiddleware.js

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed to the next function
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};
