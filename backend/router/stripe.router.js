const express = require('express');

const { getConfig, creatPayment, payment } = require('../controller/spike.controller');
const stripeRouter = express.Router();

stripeRouter.get('/config', getConfig);
stripeRouter.post('/create-payment-intent', creatPayment , payment);

module.exports = stripeRouter;