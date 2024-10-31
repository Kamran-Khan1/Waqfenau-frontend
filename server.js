import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import session from "express-session";
import flash from "connect-flash";
import env from "dotenv";

env.config({
  path: "./.env",
});
//constants
const app = express();
const PORT = process.env.PORT;
const userName = process.env.USER;
const pass = process.env.PASS;
const API = process.env.API;
//using middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
//routes

const login = (req, res, next) => {
  const { username, password } = req.body;
  if (username === userName && password === pass) {
    next();
  } else {
    res.render("login.ejs", { error: "username or password is wrong" });
  }
};

app.get("/", (req, res) => {
  res.redirect("/login");
});

//getting all the data
app.get("/12nb23n1m1n23nabjsnlan1kn2j", async (req, res) => {
  try {
    const response = await axios.get(`${API}/api/v1/users`);
    res.render("home.ejs", {
      data: response.data,
      deleteMessage: req.flash("deleteMessage"),
      updateMessage: req.flash("updateMessage"),
    });
  } catch (error) {
    res.render("home.ejs", { message: "No data exist" });
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", login, (req, res) => {
  res.redirect("/12nb23n1m1n23nabjsnlan1kn2j");
});

//getting data by specific id

app.get("/waqfenau/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const response = await axios.get(`${API}/api/v1/users/${userId}`);
  res.render("preview.ejs", { data: response.data });
});

//getting the post route for admin

app.get("/12nb23n1m1n23nabjsnlan1kn2j/new", (req, res) => {
  res.render("post.ejs", { message: req.flash("message") });
});

//getting the post route for users

app.get("/waqfenau/data/new", (req, res) => {
  res.render("userenter.ejs", { message: req.flash("message") });
});
//posting data for admin

app.post("/12nb23n1m1n23nabjsnlan1kn2j/post", async (req, res) => {
  let userResponse = req.body;
  userResponse.quran = userResponse.quran ? true : false;
  userResponse.letter = userResponse.letter ? true : false;
  userResponse.syllabus = userResponse.syllabus ? true : false;
  userResponse.joccations = userResponse.joccations ? true : false;
  const response = await axios.post(`${API}/api/v1/users`, userResponse);
  // res.json(userResponse);
  req.flash("message", response.data.message);
  res.redirect("/12nb23n1m1n23nabjsnlan1kn2j/new");
});

//posting data for user

app.post("/waqfenau/data/post", async (req, res) => {
  let userResponse = req.body;
  userResponse.quran = userResponse.quran ? true : false;
  userResponse.letter = userResponse.letter ? true : false;
  userResponse.syllabus = userResponse.syllabus ? true : false;
  userResponse.joccations = userResponse.joccations ? true : false;
  const response = await axios.post(`${API}/api/v1/users`, userResponse);
  // res.json(userResponse);
  req.flash("message", response.data.message);
  res.redirect("/waqfenau/data/new");
});

//updating data

app.get("/waqfenau/update/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const response = await axios.get(`${API}/api/v1/users/${userId}`);
    res.render("post.ejs", { data: response.data });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/post/update/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  let userResponse = req.body;
  userResponse.quran = userResponse.quran ? true : false;
  userResponse.letter = userResponse.letter ? true : false;
  userResponse.syllabus = userResponse.syllabus ? true : false;
  userResponse.joccations = userResponse.joccations ? true : false;
  const response = await axios.put(
    `${API}/api/v1/users/${userId}`,
    userResponse
  );
  req.flash("updateMessage", response.data.message);
  res.redirect("/12nb23n1m1n23nabjsnlan1kn2j");
});

//deleting data

app.get("/waqfenau/delete/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const response = await axios.delete(`${API}/api/v1/users/${userId}`);
  req.flash("deleteMessage", response.data.message);
  res.redirect("/12nb23n1m1n23nabjsnlan1kn2j");
});

app.listen(PORT, () => {
  console.log(`App is running at PORT: ${PORT}`);
});
