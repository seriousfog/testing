'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Club extends Model {
        static associate(models) {
            Club.hasMany(models.Officer, {
                foreignKey: 'clubin',
                sourceKey: 'clubname'
            });
        }
    }

    Club.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clubname: DataTypes.STRING,
        advisorfirstname: DataTypes.STRING,
        advisorlastname: DataTypes.STRING,
        meetingdate: DataTypes.STRING,
        clubroomnumber: DataTypes.STRING,
        category: DataTypes.STRING,
        clublogo: DataTypes.STRING,
        smalldescription: DataTypes.TEXT,
        secondadvisorfirstname: DataTypes.STRING,
        secondadvisorlastname: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Club',
        tableName: 'clubinfo',
        timestamps: false
    });

    return Club;
};