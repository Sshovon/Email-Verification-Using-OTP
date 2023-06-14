const lowercaseEmail = (req, res, next) => {
    if (req.body && req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    next();
  };


  module.exports = {lowercaseEmail}