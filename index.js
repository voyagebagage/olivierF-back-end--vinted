require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

app.use(cors());
const app = express();
app.use(formidable());
// app.use(formidableMiddleware());

//////_C.O.N.F.I.G_\\\\\\
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
cloudinary.config({
  cloud_name: "dcdqdnvsp",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//______________________________________________\\
//-----//_I_M_P_O_R_T_-__R_O_U_T_E_S______\\\\\\\\\\\\\\\\\\\\
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
//-\\
app.use(userRoutes);
app.use(offerRoutes);
//_______________________________________________\\
app.get("/", (req, res) => {
  res.json("Bienvenue sur mon API de Vinted");
});
//ALL ROUTE & SERVER PORT\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.all("*", (req, res) => {
  res.status(404).json({ error: "None existing route" });
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Server Launched");
});
///////////>>>>>>>>>>>>>><<<<<<<<<<<<<<<////////////
