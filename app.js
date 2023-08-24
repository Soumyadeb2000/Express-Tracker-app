const express = require('express');

const fs = require('fs')

const helmet = require('helmet');

const morgan = require('morgan')

const User = require('./models/user');

const Expense = require('./models/expense');

const Order = require('./models/order');

const DownloadedFiles = require('./models/downloadFiles');

const ForgotPasswordRequest = require('./models/forgot-password-requests');

const userRoutes = require('./router/user');

const expenseRoutes = require('./router/expense');

const purchaseRoutes = require('./router/purchase');

const premiumRoutes = require('./router/premium');

const passwordRoutes = require('./router/forgotpassword');

const sequelize = require('./utils/database');

const bodyParser = require('body-parser');

const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(helmet());

app.use(morgan('combined', {stream: accessLog}));

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use('/user', userRoutes);

app.use('/expense', expenseRoutes);

app.use('/purchase', purchaseRoutes);

app.use('/premium', premiumRoutes);

app.use('/password', passwordRoutes);

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