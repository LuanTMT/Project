const express = require('express');
const { getOrderDetail } = require('../controller/orderDetail.controler');
const { verifyToken } = require('../middlewares/verifyToken');
const orderDetailRouter = express.Router();

orderDetailRouter.get('/:id', verifyToken, getOrderDetail);



module.exports = orderDetailRouter;