const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Expense = sequelize.define('expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         unique: true,
//         primaryKey: true
//     },

//     amount: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         unique: false
//     },

//     category: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },

//     description: {
//         type: Sequelize.STRING
//     }
// });

// module.exports = Expense;