const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: "No token in x-auth-token" }] });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(401).json({ errors: [{ msg: "Invalid token" }] });
  }
};
