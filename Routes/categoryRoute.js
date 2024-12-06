const express = require("express");
const categoryController = require("../Controllers/categoryController");

const router = express.Router();

router.get("/All-Category", categoryController.getallcategories);
router.post("/", categoryController.CreateCategory);

module.exports = router;
