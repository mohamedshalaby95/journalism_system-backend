
const express = require("express");
require("express-async-errors");
const PostModel = require("./src/models/Post");
const app = express();
var cors = require("cors");
app.use(cors());
// var corsOptions = {
//   origin: "http://localhost:3000",
// };
const postModel = require("./src/models/Post");
app.use(cors(corsOptions));
const server = require("http").createServer(app);
const userRouter = require("./src/routes/users");
const handleError = require("./src/middelewares/handelError");
const authRouter = require("./src/routes/login");
const postRouter = require("./src/routes/post");
const adminAuthRouter = require("./src/routes/adminLogin");
const adminRouter = require("./src/routes/admin");
const CategoryRoute = require("./src/routes/categories");
const SubCategoryRoute = require("./src/routes/subCategory");
const AutherRoute = require("./src/routes/auther");

const adminModel = require("./src/models/admin");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"]
  },
});

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

require("dotenv/config");
require("./config/connectdb")();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// socket io start
let usersConnect = [];
const addUser = (email, socketId) => {
  const user = usersConnect.find((el) => el.email === email);
  if (!user) {
    usersConnect.push({ email, socketId });
  }
};

const removeUser = (socketId) => {
  // console.log(socketId)
  usersConnect = usersConnect.filter((el) => el.socketId !== socketId);
};
const getUser = (email) => {
  return usersConnect.find((el) => el.email === email);
};

io.on("connection", (socket) => {
  socket.on("postAccept", async (id) => {
    const post = await postModel
      .findById(id)
      .populate("auther", ["email", "_id"]);

    const notifyForSpec = getUser(post.auther.email);
   
    if (notifyForSpec) {
      socket.broadcast
        .to(notifyForSpec.socketId)
        .emit("hamada", { notify: ` you post with ${post.title} is accept` });
    } else {
      const updateadmin = async () => {
        admin = await adminModel.findOneAndUpdate(
          { email: post.auther.email },
          { $push: { notify: ` you post with ${post.title} is accept` } },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      };
      updateadmin();
    }
  });

  socket.on("postCancell", async (id) => {
    const post = await postModel
      .findById(id)
      .populate("auther", ["email", "_id"]);


    const notifyForSpec = getUser(post.auther.email);

    if (notifyForSpec) {
    
      socket.broadcast
        .to(notifyForSpec.socketId)
        .emit("hamada", { notify: ` you post with ${post.title} is canncel` });
    } else {
      const updateadmin = async () => {
        admin = await adminModel.findOneAndUpdate(
          { email: post.auther.email },
          { $push: { notify: ` you post with ${post.title} is canncel` } },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      };
      updateadmin();
    }
  });

  // add post start
  socket.on("postAdd", async (email) => {
    const reviewer = await adminModel.find({ role: "reviewer" });

    const onlineReviewer = usersConnect.map((el) => {
      for (let counter = 0; counter < reviewer.length; counter++) {
        if (reviewer[counter].email === el.email) {
       
          return reviewer[counter].email;
        }
      }
    });

  
    let reviewerOnlineNow;
    for (let i = 0; i < onlineReviewer.length; i++) {
      if (onlineReviewer[i] !== undefined) {
        reviewerOnlineNow = onlineReviewer[i];
        break;
      }
    }
    const notifyForSpec = getUser(reviewerOnlineNow);

    if (notifyForSpec) {
      socket.broadcast
        .to(notifyForSpec.socketId)
        .emit("hamada", { notify: ` post add you should reviewer` });
    } else {
      const updateadmin = async () => {
        admin = await adminModel.updateMany(
          {},
          { $push: { notify: ` post add you should reviewer` } },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      };
      updateadmin();
    }
  });

  // add post end
  socket.on("addUser", (email) => {
    console.log("add", email);
    addUser(email, socket.id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
//socket io end

app.use("/login", authRouter);
app.use("/posts", postRouter);
app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use(handleError);
app.use("/user", userRouter);

app.post("/comment", auth, async (req, res) => {
  const { body } = req;

  const data = {
    ...body,
    user: req.user._id,
    timestamp: new Date(),
  };

  console.log(data);

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

    res.json(false);
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

    res.json(true);
  }
});

app.use("/login", authRouter);

app.use("/api/categories", CategoryRoute);
app.use("/api/subcategories", SubCategoryRoute);

app.use("/admin", adminRouter);
app.use("/adminAuth", adminAuthRouter);
app.use("/auther", AutherRoute);
app.use(handleError);

server.listen(port, (error) => {
  if (error) console.log("error on server");
  console.log(`server listen on ${port}`);
});
