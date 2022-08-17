module.exports = ( sequelize, DataTypes ) => {
    const OrderDetail = sequelize.define(
        "OrderDetail",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            quantityProduct: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            timestamp: true,
        }
    );

    return OrderDetail;
}