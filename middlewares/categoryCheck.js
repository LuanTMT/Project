const db = require('../models/db.model');
const CategoryModel = db.Category;

const categoryCheck = async (req, res, next) => {
    const {name} = req.body;

    const foundCate = await CategoryModel.findOne({
        where: {
            name,
        }
    });

    if (foundCate) {
        return res.status(400).json({message: "Category is already exist"})
    }

    next();
}


module.exports = categoryCheck;