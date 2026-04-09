const User = require("../model/User");
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await User.findOne(query);
    const isAdmin = user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).send({ message: "forbidden access" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = verifyAdmin;
