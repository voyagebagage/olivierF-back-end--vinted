const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

//-----//_I_M_P_O_R_T__Models_______\\\\\\\\\\\\\\\\\\\\
const User = require("../models/User");
const Offer = require("../models/Offer");

//___________----------_____________\\\\\\\\\\\\\\\\\\

//----//-_R_-_O_-_U_-_T_-_E_-_S_____\\\\\\\\\\\\\\\\\\\\\\\
router.post("/user/signup", async (req, res) => {
  try {
    console.log("dans le sign up");
    //Genere Token & Salt
    const token = uid2(64);
    const salt = uid2(16);
    //Deconstruction: remplace directement le req.fields.X par X
    const { email, username, phone, password } = req.fields;
    const existingUser = await User.findOne({ email: req.fields.email });
    //Test of presence of username & password
    if (username && password) {
      if (!existingUser) {
        const newUser = new User({
          salt: salt,
          token: token,
          email: email,
          account: {
            username: username,
            phone: phone,
          },
          hash: SHA256(salt + password).toString(encBase64),
        });
        await newUser.save();
        //ON renvoie ce qui est demandé
        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.status(401).json({ message: "Account already exists" });
      }
    } else {
      res.status(401).json({ message: "username is missing" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    console.log("dans le sign in");
    const password = req.fields.password;
    const inUser = await User.findOne({ email: req.fields.email });
    const newHash = SHA256(inUser.salt + password).toString(encBase64);
    if (newHash === inUser.hash) {
      console.log("On peut se connecter");
      res.status(200).json(inUser);
    } else {
      res.status(402).json({ message: "Unauthorized" });

      console.log("Unauthorized");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//E_X_P_O_R_T\\
module.exports = router;
