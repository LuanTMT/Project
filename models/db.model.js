const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Product = require('./product.model') (sequelize, DataTypes);
db.User = require('./user.model') (sequelize, DataTypes);
db.Order = require('./order.model') (sequelize, DataTypes);
db.OrderDetail = require('./orderDetail.model') (sequelize, DataTypes);
db.Category = require('./category.model') (sequelize, DataTypes);
db.Cart = require('./cart.model') (sequelize, DataTypes);
db.Payment = require('./payment.model') (sequelize, DataTypes);

// Category vs Product: one-to-many
db.Category.hasMany(db.Product, {
    foreignKey: {
        name: "categoryId",
    },
    onDelete: "CASCADE",
    as: "products"
});
db.Product.belongsTo( db.Category, {
    foreignKey: {
        name: "categoryId",
    },
    as: "category"
});

// User vs Cart: one-to-many
db.User.hasMany(db.Cart, {
    foreignKey: {
        name: "userId",
    },
    onDelete: "CASCADE",
    as: "carts"
});
db.Cart.belongsTo(db.User, {
    foreignKey: {
        name: "userId",
    },
    as: "user"
});

// Product vs Cart: one-to-many
db.Product.hasMany( db.Cart, {
    foreignKey: {
        name: "productId",
    },
    onDelete: "CASCADE",
    as: "carts"
});
db.Cart.belongsTo( db.Product, {
    foreignKey: {
        name: "productId",
    },
    as: "product"
});

// User vs Order: one-to-many
db.User.hasMany(db.Order, {
    foreignKey: {
        name: "userId",
    },
    onDelete: "CASCADE",
    as: "orders"
});
db.Order.belongsTo(db.User, {
    foreignKey: {
        name: "userId",
    },
    as: "user"
});

// Order vs OrderDetail: one-to-many
db.Order.hasMany( db.OrderDetail, {
    foreignKey: {
        name: "orderId",
    },
    onDelete: "CASCADE",
    as: "orderDetails"
});
db.OrderDetail.belongsTo( db.Order, {
    foreignKey: {
        name: "orderId",
    },
    as: "order"
});

// Product vs OrderDetail: one-to-one
db.Product.hasOne( db.OrderDetail, {
    foreignKey: {
        name: "productId",
    },
    onDelete: "CASCADE",
    as: "orderDetails"
});
db.OrderDetail.belongsTo( db.Product, {
    foreignKey: {
        name: "productId",
    },
    as: "product"
});

// Order vs Payment: one-to-one
db.Order.hasOne(db.Payment,{
    foreignKey: "orderId"
});
db.Payment.belongsTo(db.Order,{
    foreignKey: "orderId"
});


db.User.sync();
db.Category.sync();
db.Product.sync();
db.Cart.sync();
db.Order.sync();
db.OrderDetail.sync();
db.Payment.sync();

module.exports = db;