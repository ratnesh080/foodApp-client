const admin = require("../utils/firebaseAdmin");
const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorised access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  admin
    .auth()
    .verifyIdToken(token)
    .then((decoded) => {
      req.decoded = {
        email: decoded.email,
        uid: decoded.uid,
      };
      next();
    })
    .catch(() => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "token is invalid" });
        }
        req.decoded = decoded;
        next();
      });
    });
};

module.exports = verifytoken;
