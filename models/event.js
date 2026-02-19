'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            // Only define association if Officer model exists
            if (models.Club) {
                Event.belongsTo(models.Club, {
                    foreignKey: 'clubown',
                    sourceKey: 'clubname'
                });
            }
        }
    }

    Event.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        eventtitle: DataTypes.STRING,
        eventdescription: DataTypes.STRING,
        eventdate: DataTypes.DATE,
        clubown: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'event',
        timestamps: false
    });

    return Event;
};