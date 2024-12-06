const express = require("express");
const DB = require("./Controllers/DB");

const app = express();

app.get("/categories", (req, res) => {
  DB.pool.query("SELECT * FROM category").then((result) => {
    return res
      .status(200)
      .json({
        status: "success",
        data: result,
      })
      .catch((error) => {
        return res.status(400).json({
          error: error.message,
        });
      });
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
