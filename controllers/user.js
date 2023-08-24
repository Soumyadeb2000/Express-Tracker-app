const User = require('../models/user')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const generateAccessToken = (user, premium) => {
    return jwt.sign({user: user, isPremium: premium}, process.env.JWT_CODE);
}

exports.signup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, process.env.SALT_ROUNDS, async (err, hash) => {
        try {
            const data = await User.create({name: name, email: email, password: hash, totalExpense: 0});
            return res.status(200).json({newUserData: data});
        } catch (error) {
            console.log(err);
            return res.status(500).json({Error: 'User with similar email exists'});
        }
        
    })
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const users = await User.findAll({where: {email: email}});
        const user = users[0];
        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true) {
                    return res.status(200).json({Message: "User login sucessful", token: generateAccessToken(user, user.isPremium)});
                }
                else {
                    return res.status(401).json({Error: "User not authorized"});
                }
            })
        }
        else {
            return res.status(404).json({Error: "User not found"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({Error: "Something went wrong"});
    } 
}
