const jwt = require("jsonwebtoken");
exports.isAdmin = (req, res, next) => {
  const tokenBarear = req.headers["authorization"].split(" ")[1];
  //   console.log(tokenBarear);
  if (!tokenBarear) {
    return res.status(400).json({ message: "No token provided" });
  }
  jwt.verify(tokenBarear, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.isAdmin = decoded.isAdmin;
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have admin privileges" });
    }
    console.log("log decode Admin: ", decoded);
    next();
  });
};
