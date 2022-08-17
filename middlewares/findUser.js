const db = require("../models/db.model");
const UserModel = db.User
const findUser = async ( req, res, next ) => {
    const data = req.params;
    const found = await UserModel.findOne({
        where:{
            id:data.id
        },
    });
    if( !found ){
        return res.status( 400 ).json({ message:"Cannot found username !!!" })
    }  
    next()  
};
module.exports = findUser