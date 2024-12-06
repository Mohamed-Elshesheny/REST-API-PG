const DB = require("../Controllers/DB");

exports.getallcategories = async (req, res) => {
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
};

exports.CreateCategory = async (req, res) => {
  try {
    const newCategory = await DB.pool.query({
      text: "INSERT INTO CATEGORY(name) VALUES ($1) RETURNING *",
      values: [req.body.name],
    });
    res.status(201).json({
      status: "success",
      data: newCategory.rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
