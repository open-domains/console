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
const mongoose = require("mongoose");
const User = require("./models/user");


const port = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.REDIRECT_URI || "https://beta.open-domains.net/auth/github/callback";
const mongoDB = process.env.MONGO;

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'static')));

mongoose
    .connect(mongoDB)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB: ", err);
    });


passport.use(new GitHubStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['user:email'],
  },
  (accessToken, refreshToken, profile, done) => {
    // Extract only the required fields from profile

    // check if user already exists in our db with the given profile ID
    User.findOne({ _id: profile.id }).then((currentUser) => {
        if (currentUser) {
            // if we already have a record with the given profile ID
            done(null, currentUser);
        } else {
            // if not, create a new user
            new User({
                _id: profile.id,
                admin: false,
                username: profile.username,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            })
            .save()
            .then((newUser) => {
                done(null, newUser);
            });
        }
    });
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
app.use(express.static('static'))


app.use("/", router);

app.use(function (req, res, next) {
    res.status(404).render("404");
});


app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});