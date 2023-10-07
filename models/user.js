const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: Boolean,
    totalExpense: Number
});

module.exports = mongoose.model('User', userSchema);

// const sequelize = require('../utils/database');

// const Sequelize = require('sequelize');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },

//     name: {type: Sequelize.STRING},

//     email: {
//         type: Sequelize.STRING,
//         unique: true
//     },   

//     password: {
//         type: Sequelize.STRING,
//         unique: true
//     },

//     isPremium:  Sequelize.BOOLEAN,

//     totalExpense: Sequelize.INTEGER

// })

// module.exports = User;