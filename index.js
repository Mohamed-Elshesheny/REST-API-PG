const express = require("express");
const AppError = require("./Utils/AppError");

const productRoute = require("./Routes/productRoute");
const categoryRoute = require("./Routes/categoryRoute");

const app = express();

app.use(express.json());

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
