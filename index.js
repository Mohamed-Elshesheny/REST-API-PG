const express = require("express");

const productRoute = require("./Routes/productRoute");
const categoryRoute = require("./Routes/categoryRoute");

const app = express();

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
