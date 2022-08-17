const express = require('express');
const { forgotPass, resetPassword, changeAvatar } = require('../controller/account.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const accountRouter = express.Router()


accountRouter.post( "/forgotpass", forgotPass);

accountRouter.put('/reset', resetPassword);

accountRouter.put('/avatar/:id', verifyToken, changeAvatar)


module.exports = accountRouter;