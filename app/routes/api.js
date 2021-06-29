const express = require('express');
const session = require('express-session');
const { redirectLogin, adminOnly, agentOnly } = require('./middlewares');
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

router.post('/create-shipment', agentOnly, async (req, res) => {
  const portId = await DBM.getPortIdByUserId(req.session.userId);  
  let {
    shipName,
    companySender,
    companyReceiver,
    container1Id,
    container2Id,
    c1g1Name,
    c1g1Weight,
    c1g1Price,
    c1g1Description,
    c2g1Name,
    c2g1Weight,
    c2g1Price,
    c2g1Description,
    c2g2Name,
    c2g2Weight,
    c2g2Price,
    c2g2Description,
  } = req.body;

  const containers = [ 
    {
      id: container1Id,
      goods: [
        {
          name: c1g1Name,
          weight: c1g1Weight,
          price: c1g1Price,
          description: c1g1Description,
        },
      ],
    },
    {
      id: container2Id,
      goods: [
        {
          name: c2g1Name,
          weight: c2g1Weight,
          price: c2g1Price,
          description: c2g1Description,
        },
        {
          name: c2g2Name,
          weight: c2g2Weight,
          price: c2g2Price,
          description: c2g2Description,
        },
      ],
    },
  ];

  // If ship doesn't exist 
  // Just add it
  let shipResult = await DBM.getShipId(shipName);
  let shipId = shipResult;

  if (!shipId) {
    shipResult = await DBM.createShip(shipName);
    shipId = await DBM.getShipId(shipName);
  } 

  // If company doesn't exist
  // Just add it
  let companyResult = await DBM.getCompanyId(companySender);
  let companyId = companyResult;

  if (!companyId) {
    companyResult = await DBM.createCompany(companySender);
    companyId = await DBM.getCompanyId(companySender);
  }

  companySender = companyId;

  companyResult = await DBM.getCompanyId(companyReceiver);
  companyId = companyResult;

  if (!companyId) {
    companyResult = await DBM.createCompany(companyReceiver);
    companyId = await DBM.getCompanyId(companyReceiver);
  }

  companyReceiver = companyId;

  companySender = await DBM.getCompanyName(companySender);
  companyReceiver = await DBM.getCompanyName(companyReceiver);
  
  console.log(`companyReceiver:${companyReceiver}`);
  
  console.log({
    portId,
    shipId,
    companySender,
    companyReceiver,
    containers
  });

  console.log(containers[1].goods);

  await DBM.createShipment({
    portId,
    shipId,
    companySender,
    companyReciever: companyReceiver,
    containers
  });


  res.redirect('/agent')
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
