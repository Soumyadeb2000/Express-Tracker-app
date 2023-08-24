const express = require('express');

const premiumController = require('../controllers/premium');

const expenseController = require('../controllers/expense');

const authentication = require('../middlewares/authorize');

const router = express.Router();

router.get('/showLeaderboard', premiumController.leaderboards);

router.get('/download', authentication.Authenticate, expenseController.download);

router.get('/download-list', authentication.Authenticate, premiumController.showDownloadedFiles)

module.exports = router;