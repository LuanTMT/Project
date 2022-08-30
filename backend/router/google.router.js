const router = require("express").Router();
const passport = require("passport");
const CLIENT_URL = "http://localhost:3000/";
const db = require('../models/db.model');
const UserModel = db.User
const jwt = require("jsonwebtoken");


var crypto = require("crypto");
const { PERMISSION_MEMBER } = require("../config/permission.config");
const md5 = require('md5');
const { DEFAULT_AVT } = require("../config/common.config");

var name = crypto.randomBytes(8).toString('hex');
var password = crypto.randomBytes(6).toString('hex');

router.get("/login/success", async (req, res) => {

    try {
        const user = req.user
        const ab = {
            username: user.id,
            hashPwd: md5(password),
            iamRole: PERMISSION_MEMBER,
            email: "voxuanluan12@gamil.com",
            // avatar: DEFAULT_AVT
            // user.photos[0].value,
        }
        const find = await UserModel.findOne({
            where: {
                username: user.id
            }
        })
        if (!find) {
            const signin = await UserModel.create(ab)

        }

        //tao token  

        const token = jwt.sign({ id: find.id }, process.env.SECRET_KEY, { expiresIn: 86400 });
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies,
                id: find.id,
                username: find.username,
                email: find.email,
                role: find.iamRole,
                accessToken: token
        });

    } catch (error) {
        return res.json({ message: error.message })
    }

});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get("/google",
passport.authenticate("google", { scope: "profile" }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

module.exports = router