const User = require('../models/user');

const DownloadedFiles = require('../models/downloadFiles');

exports.leaderboards = async (req, res, next) => {
    try {
        var leaderboard = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });
        res.status(201).json(leaderboard);
    } catch(error) {  
        res.status(500).json({Error: error});
    }
}

exports.showDownloadedFiles = async (req, res) => {
    try {
        const user = req.user;
        const downloadedFiles = await user.getDownloadedFiles();
        res.status(200).json({list: downloadedFiles[0], status: 'Data Found'})
    } catch (error) {
        res.status(500).json({Error: error});
    }
}

