const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

//////_C.O.N.F.I.G_\\\\\\\\\\\

//-----//_I_M_P_O_R_T__Models_Middlewares______\\\\\\\\\\\\\\\\\\\\
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");

//___________----------_____________\\\\\\\\\\\\\\\\\\

//----//-_R_-_O_-_U_-_T_-_E_-_S_____\\\\\\\\\\\\\\\\\\\\\\\
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    console.log("dans offer/publish");
    const {
      product_name,
      product_description,
      product_price,
      condition,
      city,
      brand,
      size,
      color,
    } = req.fields;

    const existingOffer = await Offer.findOne({ product_name: product_name });
    // if (
    //   !existingOffer &&
    //   (!existingOffer.product_description || !existingOffer.product_details)
    // ) {
    const newOffer = new Offer({
      product_name: product_name,
      product_description: product_description,
      product_price: product_price,
      product_details: [
        { condition },
        { city },
        { brand },
        { size },
        { color },
      ],
      owner: req.user,
    });
    const imgUpload = await cloudinary.uploader.upload(req.files.picture.path, {
      folder: `/vinted/newoffer/${newOffer._id}`,
    });
    newOffer.product_image = imgUpload;
    await newOffer.save();
    //   const articles = await Article.find().populate("author");
    res.status(200).json(newOffer);
    console.log(newOffer.owner);
    console.log("success");
    // } else {
    //   res.status(409).json({ message: " offer already in" });
    // }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    console.log("dans le offerS");

    let { title, priceMax, priceMin } = req.query;
    let filter = {};

    if (title) {
      filter.product_name = new RegExp(title, "i");
      console.log(filter);
    }
    if (priceMax) {
      filter.product_price = { $lte: Number(priceMax) };
    }
    if (priceMin) {
      if (filter.product_price) {
        filter.product_price.$gte = Number(priceMin);
      } else {
        filter.product_price = { $gte: Number(priceMin) };
      }
    }
    let sort = {};

    if (req.query.sort === "price-asc") {
      sort.product_price = 1;
    } else if (req.query.sort === "price-desc") {
      sort.product_price = -1;
    }

    let maxPerPage = Number(req.query.limit);
    let page;

    if (Number(req.query.page) < 1) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }

    const offers = await Offer.find(filter)
      .sort(sort)
      .limit(maxPerPage)
      .skip((page - 1) * maxPerPage)
      .select("product_name product_price")
      .select("-_id");
    //   .populate("owner", "account");

    console.log(offers);
    res.json(offers);
    // }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    console.log(":id");
    if (req.params._id && req.params._id.length) {
      const id = await Offer.findById(req.params.id).populate(
        "owner",
        "account"
      );
      if (id) {
        res.status(200).json(id);
      } else {
        res.status(400).json({ message: "Unknown ID" });
      }
    } else {
      res.status(400).json({ message: "Bad request ID" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//E_X_P_O_R_T\\
module.exports = router;
