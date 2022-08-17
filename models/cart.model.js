module.exports = ( sequelize, DataTypes ) => {
    const Cart = sequelize.define(
        "Cart",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {
            timestamp: true,
        }
    );

    return Cart;
}