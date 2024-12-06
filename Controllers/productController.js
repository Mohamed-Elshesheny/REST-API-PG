const DB = require("../Controllers/DB");
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
