const express = require('express');
const { addNewPayment, getPayment } = require('../controller/payment.controller');
const { isMember} = require('../middlewares/authJwt');
const { verifyToken } = require('../middlewares/verifyToken');
const paymentRouter = express.Router();

paymentRouter.post("/",verifyToken, isMember, addNewPayment);

paymentRouter.get('/:id', verifyToken, getPayment)

module.exports = paymentRouter;