const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const { errHandler } = require("./middlewares/errHandler");

const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");
const userRouter = require("./routes/user");
const reactionRouter = require("./routes/reaction");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/reaction", reactionRouter);

app.use(errHandler);

module.exports = app;
