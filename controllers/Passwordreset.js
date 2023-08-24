const Sib = require('sib-api-v3-sdk');

const sequelize = require('../utils/database');

const uuid = require('uuid');

const bcrypt = require('bcrypt');

const ForgotPasswordRequest = require('../models/forgot-password-requests');

const User = require('../models/user');

require('dotenv').config();

exports.updatePassword =  async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const uuid = req.params.uuid;
        let newpassword = req.query.newpassword;
        console.log(newpassword);
        const request = await ForgotPasswordRequest.findAll({ where: { id: uuid } });        
        if (!request[0] || !request[0].isActive) {
            return res.status(404).json({ error: 'Password reset request not found or invalid.' });
        }
        const user = await User.findAll({ where: { id: request[0].userId } });
        const saltRounds = process.env.SALT_ROUNDS;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) {
                console.log(err);
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt ,async function(err, hash) {
            if(err) {
                console.log(err);
                throw new Error(err);
            }
            await user[0].update({ password: hash });
            })
        })        
        await request[0].update({ isActive: false }, { transaction: t });
        await t.commit();
        return res.status(200).json({ response: 'Password Updated' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: error.message, log: 'update error' });
    }
};

exports.resetPasswordForm = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        const uuid = req.params.uuid;
        const request = await ForgotPasswordRequest.findOne({ where: { id: uuid }, transaction: t });

        if (request && request.isActive === true) {
            await t.commit();
            res.status(201).send(`
                <body>
                    <form method="get" action="/password/update-password/${uuid}">
                        <label for="newpassword"></label>
                        <input type="password" name="newpassword" id="newpassword" placeholder="Enter new password" required>
                        <input type="submit" value="Reset password">
                    </form>
                </body>
            `);
        } else {
            res.status(404).send("Password reset request not found or has already been used.");
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ Err: error.message });
    }
};

exports.sendResetUrlMail = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.api_keys;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const receiverEmail = req.body.email;
        const id = uuid.v4();
        const user = await User.findOne({where: {email: receiverEmail}});
        await user.createForgotPasswordRequest({id: id, isActive: true}, {transaction: t});
        const sender = {
            email: process.env.SENDER_EMAIL
        };
        const  receivers = [
            {
                email: receiverEmail
            }
        ];
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: `Reset password link`,
            htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`
        })
        await t.commit();
        console.log('mail sent');
    } catch (error) {
        await t.rollback();
        return res.status(500).json({Error: error})
    }
}