module.exports = ( sequelize, DataTypes ) => {
    const Category = sequelize.define(
        "Category",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            timestamp: true,
        }
    );

    return Category;
}