const express = require('express');
const { getAllUser, createUser, deleteUser, updateRole, changePassword, getUserById, updateInfoUser } = require('../controller/user.controler');
const { isAdmin, isMember} = require('../middlewares/authJwt');
const { verifyToken } = require('../middlewares/verifyToken');
const verfySignup = require('../middlewares/verifySignup');
const findUser = require('../middlewares/findUser');
const userRouter = express.Router();

userRouter.get( "/", verifyToken, isAdmin, getAllUser );

userRouter.get('/:id', verifyToken, getUserById)

userRouter.post( "/", verifyToken, isAdmin, verfySignup, createUser );

userRouter.delete( "/:id", verifyToken, isAdmin, deleteUser );

userRouter.put('/changepass/:id', verifyToken, changePassword);

userRouter.put('/info/:id', verifyToken,  isMember, updateInfoUser);

userRouter.put( "/:id", verifyToken, isAdmin, findUser, updateRole );


module.exports = userRouter;