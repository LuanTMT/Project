const db = require('../models/db.model');
const orderDetailModel = require('../models/orderDetail.model');
const ProductModel = db.Product;
const OrderModel = db.Order;
const OrderDetailModel = db.OrderDetail;
 
const getOrderDetail =  async (req, res) => {
    const idOrder = req.params.id;
    try {
      const orderDetails = await OrderDetailModel.findAll({
        where: {
          orderId: idOrder,
        },
        include: ["product"]
      })
      const resData = [];

      orderDetails.map((item) => {
        resData.push({
          quantityProduct: item.quantityProduct,
          image: item.product.image,
          title: item.product.title,
          price: item.product.price,
          size: item.product.size
        })
      })

      return res.status(200).json(resData);

    } catch (error) {
      return res.status(500).json({message: error.message})
    }
}

module.exports = { getOrderDetail};