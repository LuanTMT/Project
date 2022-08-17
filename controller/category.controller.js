const db = require('../models/db.model');
const CategoryModel = db.Category;

const getCategory = async (req, res) => {
    try {
        const categoryList = await CategoryModel.findAll();
        return res.status(200).json(categoryList);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getCateById = async (req, res) => {
    const idCate = req.params.id;
    try {
        const category = await CategoryModel.findOne({
            where: {
                id: idCate,
            }
        });

        if(!category) {
            return res.status(404).json({message: "Not found category"})
        }

        return res.status(200).json(category)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const addCategory = async (req, res) => {
    const {name} = req.body;
    try {
        await CategoryModel.create({name})
        return res.status(201).json({message: "Add Category Successfully!"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}

const deleteCategory = async (req, res) => {
    const cateId = req.params.id;
    try {
        await CategoryModel.destroy({
            where: {
                id: cateId
            }
        });
        return res.status(200).json({message: "Delete Category Successfully!"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const updateCategory = async (req, res) => {
    const cateId = req.params.id;
    const {name} = req.body;
    try {
        await CategoryModel.update({name: name},{
                where: {
                    id: cateId,
                 }   
            });

        return res.status(200).json({ message: "Update Category Successfully!" })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

module.exports = {
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    getCateById
}