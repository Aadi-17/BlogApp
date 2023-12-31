const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');                               //to hash password



//create user OR register user
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }

        //existing user
        const existinguser = await userModel.findOne({ email })
        if (existinguser) {
            return res.status(401).send({
                success: false,
                message: 'user already exists'
            });
        }

        //HASHING PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);
        //password = hashedPassword;

        //save new user
        const user = new userModel({ username, email, password: hashedPassword });
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'user created successfully',
            user,
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error in register callback',
            success: false,
            error
        })
    }
};

//get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({})
        return res.status(200).send({
            userCount: users.length,    //count users
            success: true,
            message: 'All users fetched successfully',
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in getAllUsers',
            error
        });
    }
};



//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: 'please provide email or password',
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'email not registered',
            })
        }
        //password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid username or password',
            })
        }
        else {
            return res.status(200).send({
                success: true,
                message: 'login successful',
                user
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in loginController',
            error
        });
    }
};
