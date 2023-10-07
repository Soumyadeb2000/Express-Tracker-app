const User = require('../models/user')

const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.Authenticate = async (req, res ,next) => {
    try {
        const token = req.header('Authorization');
        const login = jwt.verify(token, process.env.JWT_CODE);
        
        const user = await User.findById(login.user._id)
        console.log(user);
        req.user = user;
        console.log("asda", req.user);
        next();
    } catch (error) {
        return res.status(500).json({Error: "Something went"});
    }
}