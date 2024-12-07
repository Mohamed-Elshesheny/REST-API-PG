const express = require("express");
const categoryController = require("../Controllers/categoryController");

const router = express.Router();

router.get("/All-Category", categoryController.getallcategories);
router.post("/", categoryController.CreateCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
