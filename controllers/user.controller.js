const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');
const UserModel = require('../models/user.model');
const CommentDetailsModel = require('../models/commentDetails.model');
const PostModel = require('../models/post.model');

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
                user.id = doc.id;
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

    getUserPagination: async (req, res) => {
        try {
            let { pageSize, currentPage, search, orderBy } = req.query;

            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            search = search
            orderBy = orderBy || 'displayName'
            console.log(orderBy);
            // orderBy = "displayName"


            // Get size all user and on page
            userSize = await UserModel._collectionRef
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .get();
            let totalItem = userSize.size || 0;
            let totalPage = Math.ceil(userSize.size / pageSize) || 0

            // define users array
            var usersArray = [];
            first = await UserModel._collectionRef
                .orderBy(orderBy)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                usersData = await UserModel._collectionRef
                    .orderBy(orderBy)
                    .where(orderBy, '>=', search)
                    .where(orderBy, '<=', search + '\uf8ff')
                    .startAt(first.docs[first.docs.length - 1].data()[orderBy])
                    .limit(Number(pageSize))
                    .get();

                usersData.forEach(doc => {
                    user = doc.data();
                    user.id = doc.id;
                    usersArray.push(user); // push to usersArray
                })
            } catch (error) {

            }


            // return result
            return res.status(200).json({
                success: true,
                message: "list of user.",
                users: usersArray,
                totalItem: totalItem,
                totalPage: totalPage
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

    getAllByRole: async (req, res) => {
        try {
            let { role, pageSize, currentPage, search, orderBy } = req.query;
            role = role || 'admin'
            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            search = search
            orderBy = orderBy || 'displayName'
            // console.log(orderBy);
            // orderBy = "displayName"


            // Get size all user and on page
            userSize = await UserModel._collectionRef
                .where('role', '==', role)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .get();
            let totalItem = userSize.size || 0;
            let totalPage = Math.ceil(userSize.size / pageSize) || 0

            // define users array
            var usersArray = [];
            first = await UserModel._collectionRef
                .where('role', '==', role)
                .orderBy(orderBy)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                usersData = await UserModel._collectionRef
                    .where('role', '==', role)
                    .orderBy(orderBy)
                    .where(orderBy, '>=', search)
                    .where(orderBy, '<=', search + '\uf8ff')
                    .startAt(first.docs[first.docs.length - 1].data()[orderBy])
                    .limit(Number(pageSize))
                    .get();

                usersData.forEach(doc => {
                    user = doc.data();
                    user.id = doc.id;
                    usersArray.push(user); // push to usersArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of user.",
                users: usersArray,
                totalItem: totalItem,
                totalPage: totalPage
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
                return res.status(404).json({
                    success: false,
                    message: `user not exist.`,
                });

            if (req.body.avatarURL || req.body.displayName) { // update avatar user comment
                let userComments = await CommentDetailsModel.getAllBy('authorID', userData?._data.uid)
                userComments.forEach(async (element) => {
                    element._data.authorAvatar = req.body.avatarURL || element._data.authorAvatar;
                    element._data.displayNameAuthor = req.body.displayName || element._data.displayNameAuthor;
                    await element.save();
                });

                let postCreated = await PostModel.getAllBy('authorID', userData?._data.uid)
                postCreated.forEach(async (element) => {
                    element._data.authorAvatar = req.body.avatarURL || element._data.authorAvatar;
                    element._data.displayNameAuthor = req.body.displayName || element._data.displayNameAuthor;
                    await element.save();
                });
            }

            // if exist, change user data
            userData._data = Object.assign(userData._data, req.body);
            delete userData._data.id
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