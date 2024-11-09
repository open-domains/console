function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/github');
}

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
      return next();
    } else if (req.isAuthenticated()) {
      res.status(403).send("Forbidden");
    }
    res.redirect('/auth/github');
}

function ensureStaff(req, res, next) {
    if (req.isAuthenticated() && req.user.staffMember) {
      return next();
    } else if (req.isAuthenticated()) {
      res.status(403).send("Forbidden");
    }
    res.redirect('/auth/github');
}

module.exports = { ensureAuthenticated, ensureAdmin, ensureStaff };