const { DBM } = require('../src/DBAPI');
const { userRoutes } = require('./utils');

const redirectLogin = async (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    let { Role } = await DBM.getUserById(req.session.userId);
    Role = Role - 1;

    if (req.url === userRoutes[Role]) {
      next();
    } else {
      return res.redirect(userRoutes[Role]);
    }
  }
};

const adminOnly = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/');
  } else {
    let { Role } = await DBM.getUserById(req.session.userId);

    if (Role === 1) {
      next();
    } else {
      return res.redirect('/');
    }
  }
};

module.exports = { redirectLogin, adminOnly };
