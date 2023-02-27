module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Ce nom est déjà utilisé.'
            }
        },
        password: {
            type: DataTypes.STRING
        }
    })
}