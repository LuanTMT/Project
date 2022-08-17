const express = require('express');
const authRouter = express.Router()

const { signin, signup } =require("../controller/auth.controler");
const verfySignup = require('../middlewares/verifySignup');

authRouter.post( "/signup", verfySignup, signup );
authRouter.post( "/signin", signin );

module.exports = authRouter;