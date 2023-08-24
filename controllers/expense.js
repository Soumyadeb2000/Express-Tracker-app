const Expense = require('../models/expense');

const User = require('../models/user');

const DownloadedFiles = require('../models/downloadFiles');

const sequelize = require('../utils/database');

const AWS = require('aws-sdk');

const userServices = require('../services/userservices');

require('dotenv').config();

let ITEMS_PER_PAGE = 3;

async function sendToS3(data, fileName) {
    try {
        const BUCKET_NAME = 'expensemanagerappbymonu';
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
        const bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET
        })
        var params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            bucket.upload(params, (err, res) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log(res);
                    resolve(res.Location);
                }
            })
        })
    } catch (error) {
        return res.status(500).json({error: 'Something went wrong', message: error.message});
    }
     
}

exports.download = async (req, res) => {
    try {
        const id = req.user.id;
        const expenses = await userServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expenses${id}(${new Date()}).txt`
        const url = await sendToS3(stringifiedExpenses, fileName);
        await DownloadedFiles.create({name: req.user.name, url: url, userId: id})
        res.status(200).json({fileUrl: url, status: 'success'});
    } catch (error) {
        res.status(500).json({fileUrl: '', status: 'fail', error: error.message});
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const eid = req.params.id;
        if(eid === 'undefined' || eid === 'null' || eid === '') {
            console.log("Invalid id");
            return res.status(500).json({err: "Invalid id"});
        }
        const expenseToBeDeleted = await Expense.findAll({where: {id: eid, userId: req.user.id}})
        const expenseAmountToBeDeleted = Number(expenseToBeDeleted[0].amount);
        const users = await User.findAll({where: {id: req.user.id}});
        const updatedTotalExpense = Number(users[0].totalExpense) - expenseAmountToBeDeleted;
        await users[0].update({totalExpense: updatedTotalExpense}, {transaction: t})
        await Expense.destroy({where: {id: eid, userId: req.user.id}, transaction: t});
        await t.commit();
        return res.status(201).json({res: "Deletion successful"});
        
    } catch (error) {
        await t.rollback();
        return res.status(500).json({err: error.message})
    }
}    

exports.getExpenses = async (req, res) => {
    
    try {
        ITEMS_PER_PAGE = 1*(req.query.limit);
        console.log(ITEMS_PER_PAGE);
        let page = req.params.page;
        const expenses = await Expense.findAll({where: {userId: req.user.id}, offset: (page-1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
        const totalExpenses = await Expense.count();
        return res.status(200).json({expenses: expenses,
                                     currentPage: page,
                                     hasPreviousPage: (page > 1),
                                     previousPage: page-1,
                                     hasNextPage: page*ITEMS_PER_PAGE < totalExpenses,
                                     nextPage: (page*1)+1                       
                                    });
    } catch (error) {
        return res.status(404).json({error: "Data not found!"})
    }

}

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const category = req.body.category;
        const description = req.body.description;
        const users = await User.findAll({where: {id: req.user.id}});
        const user = users[0];
        const currentTotalExpense = Number(user.totalExpense) + Number(amount);
            await user.update({
                totalExpense: currentTotalExpense
            }, {transaction: t});
        const data = await Expense.create({amount: amount, category: category, description: description, userId: req.user.id}, {transaction: t});
        await t.commit();
        return res.status(200).json({newExpenseData: data});    
    } catch (error) {
        await t.rollback();
        return res.status(500).json({Error: error.message});
    }

}
