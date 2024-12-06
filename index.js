const express = require("express");
const DB = require("./Controllers/DB");

const app = express();

app.get("/categories", async (req, res) => {
  try {
    const categories = await DB.pool.query("SELECT * FROM category");

    return res.status(200).json({
      status: "success",
      data: categories.rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/products", async (req, res) => {
  const products = await DB.pool.query("SELECT * FROM product");
  res.status(200).json({
    status: "success",
    data: products.rows,
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
