const { Router } = require("express");

const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const passport = require('passport');

const router = Router();
const routes = require("./routes");

const ensureAuthenticated = require("./auth");

router.get("/", async (req, res) => {
  res.send("Hello World!");
});

router.get('/auth/github', passport.authenticate('github'));


router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to desired URL
    res.redirect(req.session.returnTo || '/profile');
  }
);

router.get('/profile', ensureAuthenticated, (req, res) => {
    routes.profile(req, res);
});

router.get('/raw', ensureAuthenticated, (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
});





module.exports = router;