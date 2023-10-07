const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotpasswordSchema = new Schema({
    isActive: Boolean,
    userId: String
})

module.exports = mongoose.model('ForgotPasswordRequest', forgotpasswordSchema);
// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database')

// const ForgotPassword = sequelize.define('forgotPasswordRequest', {
//     id: {
//         type: Sequelize.UUID,
//         unique: true,
//         primaryKey: true
//     },

//     isActive: Sequelize.BOOLEAN
// });

// module.exports = ForgotPassword;