'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class clubUser extends Model {
        static associate() {
            // Only define association if Officer model exists
                {
            }
        }
    }

    clubUser.init({
        email: DataTypes.STRING,
        ufirstname: DataTypes.STRING,
        ulastname: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'clubUser',
        tableName: 'clubuser',
        timestamps: false
    });

    return clubUser;
};