const express = require('express')

const router = express.Router();

const expenseController = require('../controllers/expense');

const middleware = require('../middlewares/authorize');

router.post('/add-expense', middleware.Authenticate, expenseController.postExpense);

router.get('/get-expense/:page', middleware.Authenticate, expenseController.getExpenses);

router.delete('/delete-expense/:id', middleware.Authenticate, expenseController.deleteExpense);

module.exports = router;