const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.session?.token;
  if (!token) return res.redirect('/');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.redirect('/');
  }
};