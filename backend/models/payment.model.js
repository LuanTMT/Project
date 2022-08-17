module.exports = ( sequelize, DataTypes ) => {
    const Payment = sequelize.define(
        "Payment",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            method: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {
            timestamp: true,
        }
    );
    return Payment;
}