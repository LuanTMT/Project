require('dotenv').config()
const db = require('../models/db.model');
const UserModel = db.User;
const jwt = require('jsonwebtoken');
const sendEmail = require("../service/sendEmail");
const md5 = require('md5');

const forgotPass = async (req, res) => {
    const {email} = req.body;

    try {
        const foundAccount = await UserModel.findOne({
            where: {
                email,
            }
        })

        if (!foundAccount) {
            return res.status(404).json({message: "Not found user with this email!"})
        }

        const payload = {
            email: foundAccount.email,
            id: foundAccount.id,
            username: foundAccount.username
        }

        const tempToken = jwt.sign( payload, process.env.SECRET_KEY, { expiresIn: "10m" });

        const link = `http://localhost:3000/reset/${tempToken}`

        await sendEmail(
            `${email}`,
            `EMAIL RESET PASSWORD`,
            'Click here to reset password',
            `<a href=${link} style="background-color: blue; color: white; padding: 20px; text-decoration: none">Reset Password</a>`
        )
        return res.status(200).json({
            message: "Sended email!",
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const resetPassword = async (req, res) => {
    const {newPassword, confirmPassword, token} = req.body;
    const password = md5(newPassword);
    if (!token) {
        return res.status(401).json({message: "Not token provided!"})
    }
    try {

        const decoded = jwt.verify( token, process.env.SECRET_KEY)
        idUser = decoded.id;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: "Confirm password not match with new password"})
        }
        await UserModel.update({hashPwd: password},{
            where : {
                id: idUser
            }
        })
        return res.status(200).json({message: "Reset password successfully!"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const changeAvatar = async (req, res) => {
    const idUser = req.params.id;
    const file = req.file;
    const filename = file.filename;
    try {
        await UserModel.update({avatar: filename},{
            where: {
                id: idUser,
            }
        })
        const user = await UserModel.findOne({
            where: {
                id: idUser
            }
        })
        return res.status(200).json({
            user,
            message: "Change avatar successfully!"
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    forgotPass, 
    resetPassword,
    changeAvatar
}