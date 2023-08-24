const purchaseContoller = require('../controllers/purchase');

const middleware = require('../middlewares/authorize');

const express = require('express');

const router = express.Router();

router.get('/premium-membership', middleware.Authenticate, purchaseContoller.purchasePremium);

router.post('/updateTransactionStatus', middleware.Authenticate, purchaseContoller.updateTransactionStatus);

module.exports = router;