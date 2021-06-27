const express = require('express');
const session = require('express-session');
const { redirectLogin } = require('./middlewares');
// const fetch = require('node-fetch');
const router = express.Router();
const { DBM } = require('../src/DBAPI');
const { userRoutes } = require('./utils');


router.get('/', function(req, res, next) {
  res.send(true);
});

// Server side rendered html applications for TESTING PURPOSES ONLY!
router.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method='post' action='/api/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
    </form>
  `)
});

router.get('/register', (req, res) => {
  console.log('here');
  res.send(`
    <h1>Register here please</h1>
    <form method='post' action='/api/register'>
      <input name='firstName' type='text' placeholder='First name' required />
      <input name='middleName' type='text' placeholder='Middle name' required />
      <input name='lastName' type='text' placeholder='Last name' required />
      <input name='email' type='email' placeholder='Email' required />
      <input name='role' type='number' required />
      <input name='password' type='password' requred />
      <input type='submit' />
    </form>
  `)
});

router.get('/logout', (req, res) => {
  res.send(`
    <h1>Logout</h1>
    <form method='post' action='/api/logout'>
      <input type='submit' />
    </form>
  `)
})

// Function overwrites for testing purposes only!!!
// DBM.doesUserExist = (pass, email) => pass === 'asd' && email === 'asd@asd.asd';
// DBM.getUserById = (id) => {
//   return {role: 1};
// };

router.post('/login', async (req, res) => {
  const {email, password } = req.body;

  if (email && password) {
    const userId = await DBM.doesUserExist(password, email);

    if (userId) {
      req.session.userId = userId;

      const { role } = await DBM.getUserById(req.session.userId);
      console.log(`req.session.userId=${req.session.userId}`);
      console.log(`role:${role}`);
      return res.redirect(userRoutes[role]);
    }

    return res.redirect('/');
  }

});

router.post('/register', async (req, res) => {
  if (req.session.userId) {
    const { role } = DBM.getUserById(req.session.userId);

    const portId = await getPortIdByUserId(req.session.userId)
    const portName = await getPortName(portId);

    if (userRoutes[role].endsWith('Admin')) {
      DBM.createUser({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      },
      portName);
    }
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
  });

  res.redirect('/');
});

module.exports = router;
