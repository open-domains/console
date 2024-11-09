const express = require("express");
const app = express();

require("dotenv").config();

const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ejs = require("ejs");
const multer = require('multer');
const path = require("path");
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

const port = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.REDIRECT_URI || "https://beta.open-domains.net/auth/github/callback";

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'static')));


passport.use(new GitHubStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['user:email'],
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, { ...profile, token: accessToken });
  }
));


// Serialize user to save user data to session
passport.serializeUser((user, done) => {
    done(null, user);
});
  
// Deserialize user from session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});


const router = require("./util/router");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.use(function (req, res, next) {
    res.status(404).render("404");
});


app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});