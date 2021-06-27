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
    // req.url

    let { Role } = await DBM.getUserById(req.session.userId);
    
    Role = Role - 1;

    if (req.url === userRoutes[Role]) {
      next();
    } else {
      return res.redirect(userRoutes[Role]);
    }
  }
};

module.exports = { redirectLogin };