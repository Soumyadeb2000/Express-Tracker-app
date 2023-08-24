const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    paymentId: Sequelize.STRING,

    orderId: Sequelize.STRING,

    status: Sequelize.STRING
});

module.exports = Order;