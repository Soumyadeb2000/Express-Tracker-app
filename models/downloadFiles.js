const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const DownloadedFiles = sequelize.define('downloadedFiles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    url: Sequelize.STRING,
})

module.exports = DownloadedFiles;