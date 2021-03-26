const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require("./routes/users");
const songRoutes = require("./routes/songs");
const commentRoutes = require("./routes/comments");
const session = require('express-session');
const path = require('path')

const app = express();

const port = process.env.PORT || 5000;

//connect to the database
mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log(`Database connected successfully`))
    .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/songs", songRoutes);
app.use("/comments", commentRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
    session({
      name: 'AuthCookie',
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true,
      maxAge: 1000 * 60 * 10
    })
)

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});