const db = require('../models/db.model');
const ProductModel = db.Product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const addNewProduct = async (req, res) => {
    const newProduct = req.body;

    try {
        const file = req.file;
        const filename = file.filename;
        const createProduct = await ProductModel.create({
            title: newProduct.title,
            price: newProduct.price,
            image: filename,
            size: newProduct.size,
            description: newProduct.description,
            categoryId: newProduct.categoryId,
        });
        return res.status(201).json({
            message:"Add product successfully!",
            createProduct
        });
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
};

const getAllProduct = async (req, res) => {
    try {
        const allProduct = await ProductModel.findAll();
        if(!allProduct) {
            return res.status(404).json({message: "Not fount product!"});
        }

        return res.status(200).json({
            message: "Get Product Successfully!",
            allProduct
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const getProductPagination = async (req, res) => {
    let { offset, limit } = req.query;
    offset = typeof offset === "string" ? parseInt(offset) : offset;
    limit = typeof limit === "string" ? parseInt(limit) : limit;

    let { count, rows } = await ProductModel.findAndCountAll({
        offset,
        limit
    });

    // transform rows
    rows = rows.map((row) => {
        return row.dataValues;
    });
    
    return res.status(200).json({
        count,
        limit,
        offset,
        rows
    })
};

const getProductDetailById = async (req, res) => {
    const idProduct = req.params.id;
    
    try {
        const product = await ProductModel.findOne({
            where: {
                id: idProduct
            }
        })
    
        if (!product) {
            return res.status(404).json({message: "Not found product"});
        }
    
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const getProductWithCategoryId = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const product = await ProductModel.findAll({
            where: {
                categoryId,
            }
        })
        if(!product) {
            return res.status(404).json({message: "Not found product!"})
        }

        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const getProductById = async (req, res) => {
    const idProduct = req.params.id;
    
    try {
        const product = await ProductModel.findOne({
            where: {
                id: idProduct
            }
        })

        if (!product) {
            return res.status(404).json({message: "Not found product!"})
        }

        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const getProductBySearch = async (req, res) => {
    const {key} = req.query;    
    try {
        const product = await ProductModel.findAll({
            where: {
                title: {
                    [Op.like] : '%' + key + '%'
                }
            }
        })
        if (!product) {
            return res.status(404).json({message: "Not found product you want!"})
        }
        return res.status(200).json(product)
            
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        await ProductModel.destroy({
            where: {
                id: productId,
            }
        });

        return res.status(200).json({message: "Delete Product Successfully!"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

const updateProduct = async (req, res) => {
    const idProduct = req.params.id;
    const updateProduct = req.body;
    const file = req.file;
    const filename = file.filename;
    try {
        const product = await ProductModel.findOne({ where :{
            id: idProduct,
        }})       
        if (!product) {
            return res.status(404).json({message: "Not found product"})  
        }
        await ProductModel.update({
            title: updateProduct.title,
            price: updateProduct.price,
            size: updateProduct.size,
            image: filename,
            description: updateProduct.description,
            categoryId: updateProduct.categoryId,
        },{
                where: {
                    id: idProduct,
                    }   
        });    
        return res.status(200).json({ message: "Update Products Successfully!" })
               
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};

module.exports = {
    addNewProduct,
    deleteProduct,
    getAllProduct,
    updateProduct,
    getProductPagination,
    getProductWithCategoryId,
    getProductBySearch,
    getProductById,
    getProductDetailById
};