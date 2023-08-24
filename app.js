const express = require('express');

const fs = require('fs')

const helmet = require('helmet');

const morgan = require('morgan')

const User = require('./Expense Tracker Backend/models/user');

const Expense = require('./Expense Tracker Backend/models/expense');

const Order = require('./Expense Tracker Backend/models/order');

const DownloadedFiles = require('./Expense Tracker Backend/models/downloadFiles');

const ForgotPasswordRequest = require('./Expense Tracker Backend/models/forgot-password-requests');

const userRoutes = require('./Expense Tracker Backend/router/user');

const expenseRoutes = require('./Expense Tracker Backend/router/expense');

const purchaseRoutes = require('./Expense Tracker Backend/router/purchase');

const premiumRoutes = require('./Expense Tracker Backend/router/premium');

const passwordRoutes = require('./Expense Tracker Backend/router/forgotpassword');

const sequelize = require('./Expense Tracker Backend/utils/database');

const bodyParser = require('body-parser');

const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})


app.use(express.static('public'));

app.use(helmet());

app.use(morgan('combined', {stream: accessLog}));

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use('/user', userRoutes);

app.use('/expense', expenseRoutes);

app.use('/purchase', purchaseRoutes);

app.use('/premium', premiumRoutes);

app.use('/password', passwordRoutes);

app.use((req, res) => {
    console.log(req.url);
    console.log(__dirname);
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

DownloadedFiles.belongsTo(User);
User.hasMany(DownloadedFiles);

sequelize.sync()
.then(() => {
    console.log("Server Online...");
    app.listen(process.env.PORT);
})
.catch(err => console.log(err))