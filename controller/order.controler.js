const { Op } = require('sequelize');
const db = require('../models/db.model');
const OrderModel = db.Order;

const getAllOrder = async (req, res) => {
  let { date } = req.query;

  try {

    if (date === 'all') {

        const orders = await OrderModel.findAll({
          include: ["user"]
        });
        const responseData = [];
        orders.map((order) => {
          responseData.push({
            orderId: order.dataValues.id,
            createdAt: order.dataValues.createdAt,
            username: order.user.username,
            email: order.user.email,
          })
        })
  
        if (!orders) {
          return res.status(404).json({ message: "Not found order" });
        }
        return res.status(200).json(responseData);
    } else {
      const dateNumber = parseInt(date);
      console.log(dateNumber);
      const orders = await OrderModel.findAll({
        where: {
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date().getTime() - (dateNumber * 24 * 60 * 60 *1000)).toISOString()
          }
        },
        include: ["user"]
      })
      const responseData = [];
    
      orders.map((order) => {
        responseData.push({
          orderId: order.dataValues.id,
          createdAt: order.dataValues.createdAt,
          username: order.user.username,
          email: order.user.email
        })
      })

      if (!orders) {
        return res.status(404).json({ message: "Not found order" });
      }
      return res.status(200).json(responseData);
      }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

    

};

const getOrderByIdUser = async (req, res) => {
    const idUser = req.params.id;
    
    try {
      const orders = await OrderModel.findAll({
        where: {
          userId: idUser,
        }
      });
  
      if (!orders) {
        return res.status(404).json({message: "Not found order by user"});
      }
  
      return res.status(200).json(orders)
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
}

module.exports = {
  getAllOrder,
  getOrderByIdUser
};