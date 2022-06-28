
const express = require("express");
require("express-async-errors");
const app = express();
var cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000",
};
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
const port = process.env.PORT || 4000;

require("dotenv/config");
require("./config/connectdb")();

app.use(express.json());

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
