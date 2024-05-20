const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  const tokenBarear = req.headers["authorization"].split(' ')[1];
  console.log(tokenBarear);
  if (!tokenBarear) {
    return res.status(400).json({ message: "No token provided" });
  }
  jwt.verify(tokenBarear, "your_secret_key", (err, decoded) => {
    if (err) {
      console.log('errrr:',err)
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    // req.userId = decoded.userId;
    next();
  });
};


