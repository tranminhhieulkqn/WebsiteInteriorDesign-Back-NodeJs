const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');
const UserModel = require('../models/user.model');

const saltRounds = 10;

module.exports = {
    login: async (req, res) => {
        try {
            // parse user data from req
            var userDataLogin = req.body;
            // check exist account with data
            var userData = await UserModel.getByEmail(`${userDataLogin.email}`);
            // if not exist, return error message
            if (!userData)
                return res.status(404).json({
                    success: false,
                    message: `authentication failed. user not found.`,
                });
            if (!userData.checkPassword(userDataLogin.password))
                return res.status(401).json({
                    success: false,
                    message: `authentication failed. wrong password.`,
                });
            var token = jwt.sign({ userData: userData._data }, config.secretKey, {
                expiresIn: '24h'
            });
            // return result
            return res.status(201).json({
                success: true,
                message: "user logged in successfully.",
                token: token
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    register: async (req, res) => {
        try {
            // parse user data from req
            var userData = req.body;
            // check exist with email
            var checkUserExist = await UserModel.getByEmail(`${userData.email}`);
            if (checkUserExist)
                return res.status(412).json({
                    success: false,
                    message: `user already exist.`,
                });
            // create new user info on firestore
            await UserModel.create(userData);
            // return result
            return res.status(201).json({
                success: true,
                message: "user registered successfully."
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    hashPassword: async (req, res) => {
        try {
            var password = req.query.password;
            if (!password)
                return res.status(404).json({
                    success: false,
                    message: "password required."
                })
            const hashPass = bcrypt.hashSync(password, saltRounds);
            return res.status(200).json({
                success: true,
                message: 'hashed successfully.',
                hashPass: hashPass
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllUser: async (req, res) => {
        try {
            // define users array
            var usersArray = [];
            // get users data from firestore
            var usersData = await UserModel._collectionRef.get();
            usersData.forEach(doc => {
                user = doc.data();
                user.uid = doc.id;
                delete doc.id;
                usersArray.push(user); // push to usersArray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of user.",
                users: usersArray
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    getUserBy: async (req, res) => {
        try {
            if (!req.query.id && !req.query.email)
                return res.status(404).json({
                    success: false,
                    message: 'request email or id.'
                })
            // get user data from firestore
            var userData = await UserModel.getById(`${req.query.id}`);
            if (!userData) userData = await UserModel.getByEmail(`${req.query.email}`);
            // if not exist
            if (!userData)
                return res.status(404).json({
                    success: false,
                    message: `user not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of user ${userData._id}.`,
                user: userData
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    update: async (req, res) => {
        try {
            // get user data from firestore
            var userData = await UserModel.getByEmail(`${req.body.email}`);
            // if not exist
            if (!userData)
                return res.status(200).json({
                    success: false,
                    message: `user not exist.`,
                });
            // if exist, change user data
            userData._data = req.body;
            delete userData._data.id
            // hash password
            userData._data.password = bcrypt.hashSync(req.body.password, saltRounds);
            // update to firestore
            await userData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `user ${userData.displayName} updated successfully.`
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    changePassword: async (req, res) => {
        try {
            // get user data from firestore
            var userData = await UserModel.getByEmail(`${req.query.email}`);
            // if not exist
            if (!userData)
                return res.status(200).json({
                    success: false,
                    message: `user not exist.`,
                });
            // if exist, change hashed password with bcrypt
            userData._data.password = bcrypt.hashSync(req.query.newPassword, saltRounds);
            // update to firestore
            await userData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `password of user ${userData.displayName} changed successfully.`
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    delete: async (req, res) => {
        try {
            // get user data from firestore
            var userData = await UserModel.getById(`${req.query.id}`);
            // if not exist
            if (!userData)
                return res.status(200).json({
                    success: false,
                    message: `user not exist.`,
                });
            // delete user data on firestore
            await userData.delete();
            return res.status(200).json({
                success: true,
                message: `user ${userData.displayName} deleted successfully.`,
            })
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}