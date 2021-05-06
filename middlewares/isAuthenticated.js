const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    console.log("dans le authentification");
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const user = await User.findOne({ token: token }).select("account _id");

      console.log(user);
      console.log(token);

      if (user) {
        console.log(req.user);
        req.user = user;
        console.log(req.user);
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = isAuthenticated;
