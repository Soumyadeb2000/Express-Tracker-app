const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadedFilesSchema = new Schema({
    url: String
})

module.exports = mongoose.model('downloadedFiles', downloadedFilesSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const DownloadedFiles = sequelize.define('downloadedFiles', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },

//     url: Sequelize.STRING,
// })

// module.exports = DownloadedFiles;