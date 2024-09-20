function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next();
    } else {
        res.redirect('/auth/signin');
    }
}

module.exports = { isAuthenticated };
