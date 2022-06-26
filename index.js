const express = require("express");
require("express-async-errors");
const PostModel = require("./src/models/Post");
const app = express();
const userRouter = require("./src/routes/users");
const handleError = require("./src/middelewares/handelError");
const authRouter = require("./src/routes/login");
const postRouter = require("./src/routes/post");
const adminAuthRouter = require("./src/routes/adminLogin");
const adminRouter = require("./src/routes/admin");
const CategoryRoute = require("./src/routes/categories");
const SubCategoryRoute = require("./src/routes/subCategory");
const AutherRoute = require("./src/routes/auther");
const Pusher = require("pusher");
var cors = require("cors");
const port = process.env.PORT || 4000;
const auth = require("./src/middelewares/auth");

const pusher = new Pusher({
  appId: "1428285",
  key: "7d5a00f0cb139e7cc884",
  secret: "4ce4bc0fd1246f2370a7",
  cluster: "eu",
  useTLS: true,
});

app.use(express.json());

app.use(cors());
require("dotenv/config");
require("./config/connectdb")();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/login", authRouter);
app.use("/posts", postRouter);
app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use(handleError);
app.use("/user", userRouter);

app.post("/comment", auth, async (req, res) => {
  const { body } = req;

  console.log(req.user._id);
  const data = {
    ...body,
    user: req.user._id,
  };

  const { postId } = req.body;

  const comment = await PostModel.findOneAndUpdate(
    { _id: postId },
    { $push: { comments: data } },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).populate("comments.user", ["firstName", "lastName", "image"], {
    strictPopulate: false,
  });
  pusher.trigger("magz", "new-comment", comment);

  res.json(comment);
});

app.post("/like", auth, async (req, res) => {
  const data = {
    user: req.user._id,
  };

  const { postId } = req.body;

  const post = await PostModel.findById(postId);
  // console.log(post.likes.filter((like) => {console.log(like.user,data.user,like.user==data.user) }));

  let userLikedPost = post.likes.find((like) => like.user == data.user);
  if (userLikedPost) {
    let userIndex = post.likes.findIndex((like) => {
      return like.user == userLikedPost.user;
    });
    console.log(userIndex);
    console.log(post.likes[userIndex]);
    const like = await PostModel.findOneAndUpdate(
      { _id: postId },
      {$pull : {likes : post.likes[userIndex] }},
      
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    pusher.trigger("magz", "new-like", like);
    console.log("Done",like);

    res.json(like);
  } else {
    const like = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: data } },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    pusher.trigger("magz", "new-like", like);

    res.json(like);
  }
});

app.use("/login", authRouter);

app.use("/api/categories", CategoryRoute);
app.use("/api/subcategories", SubCategoryRoute);

app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use("/auther", AutherRoute);
app.use(handleError);

app.listen(port, (error) => {
  if (error) console.log("error on server");
  console.log(`server listen on ${port}`);
});
