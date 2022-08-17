const db = require('../models/db.model');
const ProductModel = db.Product;
const CartModel = db.Cart;

const deleteCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    await CartModel.destroy({
      where: {
        id: cartId,
      }
    });

    return res.status(200).json({ message: "Delete Cart Successfully!" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getCart = async (req, res) => {
  const {id} = req.params;
  try {
    const carts = await CartModel.findAll({
      where: {
        userId: id
      },
      include: ["product", "user"]
    })
    if (!carts || carts.length === 0) {
      return res.status(200).json([])
    }
    const responsedData = {
      countItem: carts.length,
      username: carts[0].user.username,
      email: carts[0].user.email,
      items: [],
    };

    carts.forEach((cart) => {
      const productObj = cart.product;
      const {
        id: productId,
        title,
        price,
        size,
        image,
      } = productObj;

      responsedData.items.push({
        productId,
        cartId: cart.id,
        title,
        price,
        size,
        image,
      });
    });

    return res.status(200).json(responsedData);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}
const addProductToCart = async (req, res) => {
    const { id } = req.params;
    const {idProduct} = req.body;
    const data = {
      userId: id,
      productId: idProduct
    }
    try {
      const foundProduct = await CartModel.findOne({
        where: {
          productId: idProduct,
          userId: id,
        }
      });

      if (foundProduct) {
        return res.status(401).json({message: "Product is exist in cart!"})
      }

      await CartModel.create(data)
      return res.status(201).json({message: "Add to cart successfully!"})
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
}
module.exports = { 
  getCart, 
  addProductToCart, 
  deleteCart,  
};