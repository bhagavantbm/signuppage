const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const ejsmate = require("ejs-mate");
const path = require("path");
require("dotenv").config();

const User = require("./models/user/login"); // Replace with the actual path to your User schema/model

const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

// EJS configuration
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// Flash Messages & Passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for setting flash messages and user context
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Root Route
app.get("/", (req, res) => {
  res.render("user/index"); // Note: Only specify relative path after 'views/'
});

// Load Routes
const userRoutes = require("./routes/user"); // Modularize routes
app.use("/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

// Start the server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
