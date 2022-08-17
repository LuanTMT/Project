require('dotenv').config()
const jwt = require("jsonwebtoken");

const verifyToken = ( req, res, next ) => {
    let token = req.headers[ "x-access-token"];

    //return 403 error if token not found
    if( !token ){
        return res.status( 403 ).json({
            messege:" Notoken provided!",
        });
    }
    
    //verify jwt token
    jwt.verify( token, process.env.SECRET_KEY, ( err, decoded ) => {
        if( err ){
            return res.status( 403 ).json({
                messege:"Forbiden! Requeries a token to access",
            });
        }
        req.userID = decoded.id;
        next();
    });
};
module.exports = { verifyToken }