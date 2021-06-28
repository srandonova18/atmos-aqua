const { DBM } = require('../src/DBAPI');
const { userRoutes } = require('./utils');

// Function overwrite for testing purposes only.
// DBM.getUserById = (id) => {
//   return {role: 1};
// };

const redirectLogin = async (req, res, next) => {
  if (!req.session.userId) {
    console.log(req.session.userId);
    res.redirect('/');
  } else {
    let { Role } = await DBM.getUserById(req.session.userId);
    
    // console.log(`from middlewares.js: Role: ${Role}`);
    // console.log(`from middlewares.js: req.session.userId: ${req.session.userId}`);

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
    // console.log(req.session.userId);
    // console.log(Role);

    if (Role === 1) {
      next();
    } else {
      return res.redirect('/');
    }
  }
};

module.exports = { redirectLogin, adminOnly };