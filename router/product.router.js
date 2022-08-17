const express = require('express');
const { isAdmin} = require('../middlewares/authJwt');
const { verifyToken } = require('../middlewares/verifyToken');
const { addNewProduct, deleteProduct, getAllProduct, updateProduct, getProductPagination, getProductWithCategoryId, getProductBySearch, getProductById, getProductDetailById } = require('../controller/product.controller');
const productRouter = express.Router();

productRouter.get('/search', getProductBySearch);

productRouter.get('/', getProductPagination);

productRouter.get('/category/:id', getProductWithCategoryId);

productRouter.get('/detail/:id', getProductDetailById);

productRouter.post('/', verifyToken, isAdmin, addNewProduct);

productRouter.get('/:id', verifyToken, isAdmin,  getProductById);

productRouter.delete('/:id', verifyToken, isAdmin, deleteProduct);

productRouter.put('/:id', verifyToken, isAdmin, updateProduct );

module.exports = productRouter;