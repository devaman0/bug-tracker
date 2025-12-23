// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.role === 'Admin') {
    return next();
  }
  res.status(403).send('Access denied. Admin privileges required.');
}

module.exports = { isAuthenticated, isAdmin };
