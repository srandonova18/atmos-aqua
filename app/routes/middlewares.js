const { DBM } = require('../src/DBAPI');
const { userRoutes } = require('./utils');

DBM.getUserById = (id) => {
  return {role: 1};
};

const redirectLogin = async (req, res, next) => {
  if (!req.session.userId) {
    console.log(req.session.userId);
    res.redirect('/');
  } else {
    // req.url

    const { role } = await DBM.getUserById(req.session.userId);

    if (req.url === userRoutes[role]) {
      next();
    } else {
      return res.redirect(userRoutes[role]);
    }
  }
};

module.exports = { redirectLogin };