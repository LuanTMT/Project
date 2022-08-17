const md5 = require('md5');
const { DEFAULT_AVT } = require('../config/common.config');
const { PERMISSION_MEMBER } = require('../config/permission.config');
const db = require('../models/db.model');
const UserModel = db.User

const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    if (!users) {
      return res.status(404).json({ message: "Error: server not found data " });
    }

    return res.status(200).json(users);

  } catch (error) {
    return res.status(500).json({ message: "Server got error" });
  }
};


const getUserById = async (req, res) => {
  const idUser = req.params.id;

  try {
    const user = await UserModel.findOne({
      where: {
        id: idUser,
      }
    });

    if(!user) {
      return res.status(404).json({message: "Not found user"})
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const changePassword = async (req, res) => {
    const idUser = req.params.id;
    const {currentPassword, newPassword } = req.body;
    if (currentPassword === newPassword) {
      return res.status(400).json({message: "New password must not be the same as old password"})
    }
    try {
    const user = await UserModel.findOne({
      where: {
        id: idUser,
      }
    })
    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
    if(md5(currentPassword) !== user.hashPwd) {
      return res.status(400).json({message: "Current password is incorrect!"})
    }

    const hashPwd = md5(newPassword);

      await UserModel.update({hashPwd: hashPwd},{
        where: {
          id: idUser,
        }
      });

      return res.status(200).json({message: "Update password successfully!"})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
}

const updateInfoUser = async (req, res) => {
  const idUser = req.params.id;
  const { fullName, phone, address } = req.body;
  if(fullName === '' || phone === '' || address === '') {
    return res.status(400).json({message: "Require feild all input!"})
  }
  try {
    await UserModel.findOne({
      where: {
        id: idUser,
      }
    })
    if(!user) {
      return res.status(404).json({message: "Not found user!"})
    }

    await UserModel.update({fullName: fullName, phone: phone, address: address},{
      where: {
        id: idUser,
      }
    })
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const createUser = async (req, res) => {
  const {   
    username,  
    password,
    email,
  } = req.body
  try {
    const createData = { 
      username: username,   
      hashPwd: md5(password),
      iamRole: PERMISSION_MEMBER,
      email: email,
      avatar: DEFAULT_AVT, 
    };
    await UserModel.create(createData);
    return res.status(201).json({
      message: "Add user successfully!",
      createData
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
      // "server is getting error when creating new User account"
    });
  }
}

const deleteUser =  async (req, res) => {

  const {id} = req.params;
  try {
      await UserModel.destroy({
          where: {
            id: id,
          }
      });
      return res.status(200).json({message: "Delete User Successfully!"})
  } catch (error) {
      return res.status(500).json({message: error.message})
  }
};

const updateRole = async (req, res) => {
  const {id} = req.params;
  const {iamRole} = req.body;
  try {
      await UserModel.update(
          {iamRole:iamRole},{
              where: {
                  id: id,
               }   
          });

      return res.status(200).json({ message: "Update Role Successfully!" })
  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}
module.exports = { 
  getAllUser, 
  createUser, 
  deleteUser, 
  updateRole,
  changePassword,
  getUserById,
  updateInfoUser
}