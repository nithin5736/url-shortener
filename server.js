const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Url = require("./models/url");

mongoose
  .connect("mongodb://localhost:27017/urlshortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database connection error");
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const urls = await Url.find();
  res.render("index", { urls });
});

app.post("/shorten", async (req, res) => {
  await Url.create({ longUrl: req.body.url });
  res.redirect("/");
});

app.get("/:shorturl", async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shorturl });
  if (url === null) res.status(404);
  else res.redirect(url.longUrl);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
