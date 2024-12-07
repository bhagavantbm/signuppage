const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const User = require("./models/user/login");
const ejsmate = require("ejs-mate");
const path = require("path");
require("dotenv").config();

const app = express();

// Database Connection
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
connectToDB();

// EJS Engine Configuration
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Session Configuration with MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret", // Use environment variable or fallback
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

// Routes
const userRoutes = require("./routes/user");
app.use("/", userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

// Dynamic Port for Render Hosting
const PORT = process.env.PORT || 9090; 
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
