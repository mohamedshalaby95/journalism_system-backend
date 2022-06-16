const express = require("express");
require("express-async-errors");
const app = express();
const userRouter = require("./src/routes/users");
const handleError = require("./src/middelewares/handelError");
const authRouter = require("./src/routes/login");
const postRouter = require("./src/routes/post");
const adminAuthRouter = require("./src/routes/adminLogin");
const adminRouter = require("./src/routes/admin");
const CategoryRoute = require("./src/routes/categories");
const SubCategoryRoute = require("./src/routes/subCategory");
var cors = require("cors");
const port = process.env.PORT || 4000;

app.use(cors());
require("dotenv/config");
require("./config/connectdb")();

app.use(express.json());

app.use("/login", authRouter);
app.use("/posts", postRouter);
app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use(handleError);
app.use("/user", userRouter);

app.use("/login", authRouter);

app.use("/api/categories", CategoryRoute);
app.use("/api/subcategories", SubCategoryRoute);

app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use(handleError);

app.listen(port, (error) => {
  if (error) console.log("error on server");
  console.log(`server listen on ${port}`);
});
