const express = require("express");
const productController = require("../Controllers/productController");

const router = express.Router();

router.get("/All-products", productController.getallproducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
