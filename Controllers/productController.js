const { NULL } = require("sass");
const DB = require("../Controllers/DB");
const AppError = require("../Utils/AppError");
const Catchasync = require("express-async-handler");

exports.getallproducts = async (req, res) => {
  try {
    const products = await DB.pool.query(`
          SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.currency,
            p.quantity,
            p.created_date,
            p.updated_date,
            (SELECT ROW_TO_JSON(category_obj)
             FROM (
                 SELECT id, name 
                 FROM category 
                 WHERE id = p.category_id
             ) category_obj) AS category
          FROM product p;
        `);

    return res.status(200).json({
      status: "success",
      data: products.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Old one

// exports.createProduct = Catchasync(async (req, res, next) => {
//   const category = await DB.pool.query({
//     text: "INSERT INTO product(name,description,price,currency,quantity,active,category_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
//     values: [
//       req.body.name,
//       req.body.description ? req.body.description : null,
//       req.body.price,
//       req.body.currency ? req.body.currency : "USD",
//       req.body.quantity ? req.body.quantity : 0,
//       "active" in req.body ? req.body.active : true,
//       req.body.category_id,
//     ],
//   });
//   res.status(201).json({
//     status: "success",
//     data: category.rows,
//   });
// });

exports.createProduct = Catchasync(async (req, res, next) => {
  // Destructure and provide default values
  const {
    name,
    description = null,
    price,
    currency = "USD",
    quantity = 0,
    active = true,
    category_id,
  } = req.body;

  // Validate required fields
  if (!name || !price || !category_id) {
    return next(
      new AppError("Missing required fields: name, price, category_id", 422)
    );
  }

  const existsProducts = await DB.pool.query(
    `SELECT EXISTS (SELECT * FROM product WHERE name = $1)`,
    [name]
  );

  if (existsProducts.rows[0].exists) {
    return next(new AppError("There is a product with this name ALREADY", 409));
  }

  // Insert product into the database
  const product = await DB.pool.query(
    `INSERT INTO product (name, description, price, currency, quantity, active, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, price, currency, quantity, active, category_id]
  );

  res.status(201).json({
    status: "success",
    data: product.rows[0], // Return the created product directly
  });
});

exports.updateProduct = Catchasync(async (req, res, next) => {
  const { id } = req.params; // Extract product ID from the URL
  const { name, description, price, currency, quantity, active, category_id } =
    req.body; // Extract fields from the request body

  // Validate the ID
  if (!id) {
    return next(new AppError("Please provide a valid product ID", 409));
  }

  // Validate input fields (optional)
  if (!name || !price || !category_id) {
    return next(new AppError("Required fields: name, price, category_id", 422));
  }
  const existsProducts = await DB.pool.query(
    `SELECT EXISTS (SELECT * FROM product WHERE name = $1)`,
    [name]
  );

  if (existsProducts.rows[0].exists) {
    return next(new AppError("There is a product with this name ALREADY", 409));
  }

  // Perform the update query
  const updatedProduct = await DB.pool.query(
    `
    UPDATE product
    SET name = $1,
        description = $2,
        price = $3,
        currency = $4,
        quantity = $5,
        active = $6,
        category_id = $7,
        updated_data = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *`,
    [name, description, price, currency, quantity, active, category_id, id]
  );

  // Check if the product was found and updated
  if (updatedProduct.rows.length === 0) {
    return next(new AppError("Product not found", 404));
  }

  // Return the updated product
  res.status(200).json({
    status: "success",
    data: updatedProduct.rows[0],
  });
});

exports.deleteProduct = Catchasync(async (req, res, next) => {
  const { id } = req.params; // Extract product ID from the URL

  // Validate the ID
  if (!id) {
    return next(new AppError("Please provide a valid product ID", 409));
  }

  // Perform the delete query
  const deletedProduct = await DB.pool.query(
    `
    DELETE FROM product
    WHERE id = $1
    RETURNING *`,
    [id]
  );

  // Check if the product was found and deleted
  if (deletedProduct.rows.length === 0) {
    return next(new AppError("Product not found", 404));
  }

  // Return success response
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct.rows[0], // Optionally return the deleted product
  });
});