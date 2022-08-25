const express = require('express');

const { getConfig, creatPayment } = require('../controller/spike.controller');
const stripeRouter = express.Router();

stripeRouter.get('/config', getConfig);
stripeRouter.post('/create-payment-intent', creatPayment);

module.exports = stripeRouter;