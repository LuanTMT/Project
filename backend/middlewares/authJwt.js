const { PERMISSION_ADMIN, PERMISSION_MEMBER } = require('../config/permission.config');
const db = require('../models/db.model');
const UserModel = db.User;

//verify if it's admin permission
const isAdmin = async( req, res, next ) => {
    const id = req.userID
    const user = await UserModel.findOne({ where: { id }});  
    if (user.iamRole === PERMISSION_ADMIN ){       
        return next();
    }
    return res.status( 403 ).json({
        messege:"Forbidden!require admin role",
    });
};
//very if it;s member permission
const isMember = async( req, res, next ) => {
    const id = req.userID;
    const user = await UserModel.findOne({ where: { id }});
    if (user.dataValues.iamRole === PERMISSION_MEMBER ){     
        return next();        
    }
    return res.status( 403 ).json({
        messege:"Forbidden!require member role",
    });
};


const authJwt = {  
    isAdmin,   
    isMember,
};
module.exports = authJwt;