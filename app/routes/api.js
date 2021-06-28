const express = require('express');
const session = require('express-session');
const { redirectLogin, adminOnly } = require('./middlewares');
const router = express.Router();
const { DBM } = require('../src/DBAPI');
const { userRoutes } = require('./utils');

router.post('/register-port', async (req, res) => {
  const {
    portName,
    coordinates,
    firstName,
    middleName,
    lastName,
    email,
    password,
  } = req.body;

  let role = 1;

  await DBM.createPort({name: portName, coordinates: [{lat: 6, lng: 9}]});

  await DBM.createUser({
    firstName,
    middleName,
    lastName,
    email,
    role: 1,
    password
  }, portName);

  const { Id } = await DBM.getUserByEmail(email);

  req.session.userId = Id;

  res.redirect('/admin');
});

router.post('/login', async (req, res) => {
  const {email, password } = req.body;

  if (email && password) {
    const userId = await DBM.doesUserExist(password, email);

    if (userId) {
      req.session.userId = userId;

      let { Role } = await DBM.getUserById(req.session.userId);
      Role = Role - 1;

      return res.redirect(userRoutes[Role]);
    }

    return res.redirect('/');
  }
});

router.post('/add-user', adminOnly, async (req, res) => {
  const portId = await DBM.getPortIdByUserId(req.session.userId);
  const portName = await DBM.getPortName(portId);

  DBM.createUser({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password
  }, portName);

  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
  });

  res.redirect('/');
});

router.get('/get-shipment', redirectLogin, async (req, res) => {
  const portId = await DBM.getPortIdByUserId(req.session.userId);
  const portName = await DBM.getPortName(portId);

  const { shipmentId } = req.body;

  const result = await DBM.getShipmentFromPort(portName, shipmentId);

  res.send(result);
});

// FIXME: Remove temporary server-side rendered html webpages for testing
router.get('/register-port', async (req, res) => {
  res.send(`
    <h1>Register-port</h1>
    <form method='post' action='/api/register-port'>
      <input name='portName' type='text' placeholder='port name' required />
      <input name='coordinates' type='text' placeholder='coords' required />
      <input name='firstName' type='text' placeholder='First name' required />
      <input name='middleName' type='text' placeholder='Middle name' required />
      <input name='lastName' type='text' placeholder='Last name' required />
      <input name='email' type='email' placeholder='Email' required />
      <input name='password' type='password' placeholder='password' required />

      <input type='submit' />
    </form>
  `);
});

router.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method='post' action='/api/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required />
      <input type='submit' />
    </form>
  `);
});

router.get('/add-user', adminOnly, async (req, res) => {
  res.send(`
    <h1>Add user</h1>
    <form method='post' action='/api/add-user'>
      <input name='firstName' type='text' placeholder='First name' required />
      <input name='middleName' type='text' placeholder='Middle name' required />
      <input name='lastName' type='text' placeholder='Last name' required />
      <input name='email' type='email' placeholder='Email' required />
      <input name='role' type='number' placeholder='2' required />
      <input name='password' type='password' placeholder='password' required />

      <input type='submit' />
    </form>
  `);
});

router.get('/logout', (req, res) => {
  res.send(`
    <h1>Logout</h1>
    <form method='post' action='/api/logout'>
      <input type='submit' />
    </form>
  `);
});

module.exports = router;
