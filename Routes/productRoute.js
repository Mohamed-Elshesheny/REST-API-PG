const express = require("express");
const productController = require("../Controllers/productController");

const router = express.Router();

router.get("/All-products", productController.getallproducts);

module.exports = router;
