const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs/configs');
const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const UserRecordsModel = require('../models/userRecords.model');
const CommentDetailsModel = require('../models/commentDetails.model');
const fs = require('fs');
const natural = require('natural');

function ObTFIDF(id, weights) {
    this.id = id;
    this.weights = weights;
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str.toLowerCase();
}

function getMostFrequent(arr) {
    try {
        const hashmap = arr.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1
            return acc
        }, {})
        return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
    } catch (error) {
        return ''
    }
}

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

            console.log(pageSize * (currentPage - 1) + 1);
            console.log(first.docs.length - 1);

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
    },

    getRecommendedDesignerbyIDUser: async (req, res) => {
        try {
            // get param from query request
            let { amount, userID } = req.query;
            amount = amount || 1; // if not exists => 1
            if (!userID) // require user ID
                throw new Error('post id and user id required.');

            // get history viewed post from user ID
            var userRecords = await UserRecordsModel.getBy('userID', `${userID}`);
            var favoriteStyles = userRecords._data.favoriteStyles.slice(-5);
            var viewedPostID = userRecords._data.viewedPosts.slice(-10);

            // get viewed post user
            viewedPost = await PostModel._collectionRef
                .orderBy('dateCreated', 'desc')
                .where('id', 'in', viewedPostID)
                .get();

            categoryArray = []
            mainColorArray = []
            patternArray = []

            viewedPost.forEach(doc => {
                item = doc.data();
                categoryArray.push(item.category);
                mainColorArray = mainColorArray.concat(item.mainColor)
                patternArray = patternArray.concat(item.pattern)
            })


            categoryArray = getMostFrequent(categoryArray.concat(favoriteStyles)) || ''
            mainColorArray = getMostFrequent(mainColorArray) || ''
            patternArray = getMostFrequent(patternArray) || ''

            // create string to recommented posts
            viewedPostsString = ''.concat(categoryArray, " ", mainColorArray, " ", patternArray)

            // Việt
            TfIdf = natural.TfIdf, tfidf = new TfIdf();
            var ArrObject = []

            var designerArray = await UserModel._collectionRef.where('role', "==", 'designer').get()
            designersID = []
            designersDataArray = []
            designerArray.forEach(async (designer) => {
                // Save infor designer
                item = designer.data()
                item.id = designer.id;
                designersDataArray.push(item)
            });

            for (let index = 0; index < designersDataArray.length; index++) {
                const designer = designersDataArray[index];
                var categoryArray = []
                var colorArray = []
                var patternArray = []
                var postsData = await PostModel.getAllBy(`authorID`, `${designer.id}`)
                if (postsData.length) {
                    postsData.forEach(element => {
                        categoryArray.push(element._data['category'])
                        colorArray = colorArray.concat(element._data['mainColor'])
                        patternArray = patternArray.concat(element._data['pattern'])
                    });
                    designersID.push(designer.id)
                    // add feature to list tfidf
                    document = ''.concat(getMostFrequent(categoryArray), " ", getMostFrequent(colorArray), " ", getMostFrequent(patternArray))
                    // console.log(document, " ", designer.id)
                    tfidf.addDocument(document)
                }
            }

            tfidf.tfidfs(removeVietnameseTones(viewedPostsString).toLocaleLowerCase(), function (i, measure) {
                var ob = new ObTFIDF(id = designersID[i], weights = measure)
                ArrObject.push(ob);
            });

            // sort with weights
            ArrObject = ArrObject.sort((a, b) => parseFloat(b.weights) - parseFloat(a.weights))
            
            // amout post get
            amount = (amount < designersID.length) ? amount : designersID.length;

            let results = []

            for (let index = 0; index < amount; index++) {
                let temp = designersDataArray[designersDataArray.findIndex(post => post.id === ArrObject[index].id)]
                results.push(designersDataArray[designersDataArray.findIndex(post => post.id === ArrObject[index].id)])
            }

            console.log(results);

            return res.status(200).json({
                success: false,
                message: `data of designer`,
                designers: results
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

    }
}