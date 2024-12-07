const DB = require("../Controllers/DB");
const AppError = require("../Utils/AppError");
const Catchasync = require("express-async-handler");

exports.getallcategories = Catchasync(async (req, res, next) => {
  const categories = await DB.pool.query("SELECT * FROM category");

  if (!categories) {
    return next(new AppError("No Categories Found", 404));
  }

  return res.status(200).json({
    status: "success",
    data: categories.rows,
  });
});

exports.CreateCategory = Catchasync(async (req, res, next) => {
  if (!req.body.name) {
    return next(new AppError("Category must have a name", 422));
  }

  // Check if the category already exists
  const existsCategory = await DB.pool.query({
    text: "SELECT EXISTS (SELECT * FROM category WHERE name = $1)",
    values: [req.body.name],
  });

  if (existsCategory.rows[0].exists) {
    return next(
      new AppError("There is a category with this name ALREADY", 409)
    );
  }

  // Insert new category
  const newCategory = await DB.pool.query({
    text: "INSERT INTO category(name) VALUES ($1) RETURNING *",
    values: [req.body.name],
  });

  res.status(201).json({
    status: "success",
    data: newCategory.rows[0],
  });
});

exports.updateCategory = Catchasync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    console.log("Validation Failed: Missing name");
    return next(new AppError("Category name is required", 422));
  }

  const existsCategory = await DB.pool.query(
    `SELECT EXISTS (SELECT * FROM category WHERE name = $1)`,
    [name]
  );

  if (existsCategory.rows[0].exists) {
    return next(
      new AppError(`There is a CATEGORY with this ${name} already`, 409)
    );
  }

  const updatedCategory = await DB.pool.query(
    `UPDATE category 
     SET name = $1, updated_data = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [name, id]
  );

  if (updatedCategory.rows.length === 0) {
    return next(
      new AppError(`Category with this id ${id} not found`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: updatedCategory.rows[0],
  });
});

exports.deleteCategory = Catchasync(async (req, res, next) => {
  const { id } = req.params; // Extract category ID from the URL

  // Validate the ID
  if (!id) {
    return next(new AppError("Please provide a valid category ID", 409));
  }

  // Perform the delete query
  const deletedCategory = await DB.pool.query(
    `
    DELETE FROM category
    WHERE id = $1
    RETURNING *`,
    [id]
  );

  // Check if the category was found and deleted
  if (deletedCategory.rows.length === 0) {
    return next(new AppError("Category not found", 404));
  }

  // Return success response
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: deletedCategory.rows[0], // Optionally return the deleted category
  });
});