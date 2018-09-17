const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

generateToken = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: "3d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.generateToken = generateToken;
