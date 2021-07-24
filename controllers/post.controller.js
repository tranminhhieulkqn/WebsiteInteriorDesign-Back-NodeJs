const fs = require('fs');
const natural = require('natural');
const PostModel = require('../models/post.model');
const PostsHistoryModel = require('../models/postsHistory.model')

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

module.exports = {
    create: async (req, res) => {
        try {
            postData = req.body;
            if (!postData)
                return res.status(404).json({
                    success: false,
                    message: 'no info post.'
                });
            var postCreated = await PostModel.create(postData);
            return res.status(200).json({
                success: true,
                message: 'post created successfully.',
                post: postCreated
            })
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

    likePost: async (req, res) => {
        try {
            let { postID, userID } = req.query;
            if (!postID || !userID)
                throw new Error('post id and user id required.');
            let postData = await PostModel.getById(`${postID}`);
            if (!postData)
                throw new Error('post is not exists.');
            postData._data.liked.push(userID)
            // remove duplicates
            postData._data.liked = postData._data.liked.filter((value, index, self) => {
                return self.indexOf(value) === index;
            })
            postData._data.likesCount = postData._data.liked.length
            // update to firestore
            await postData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `user id = '${userID}' liked post id = ${postID}.`
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

    unlikePost: async (req, res) => {
        try {
            let { postID, userID } = req.query;
            if (!postID || !userID)
                throw new Error('post id and user id required.');
            let postData = await PostModel.getById(`${postID}`);
            if (!postData)
                throw new Error('post is not exists.');
            let indexDelete = postData._data.liked.indexOf(userID)
            postData._data.liked.splice(indexDelete, 1)
            //
            postData._data.likesCount = postData._data.liked.length
            // update to firestore
            await postData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `user id = '${userID}' unlike post id = ${postID}.`
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

    getAllPost: async (req, res) => {
        try {

            let { pageSize, currentPage, search, orderBy } = req.query;

            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            search = search
            orderBy = orderBy || 'title'

            // Get size all user and on page
            postSize = await PostModel._collectionRef
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .get();
            let totalItem = postSize.size || 0;
            let totalPage = Math.ceil(postSize.size / pageSize) || 0

            // define posts array
            var postsArray = [];
            // get posts data from firestore
            var postsData;

            first = await PostModel._collectionRef
                .orderBy(orderBy)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                postsData = await PostModel._collectionRef
                    .orderBy(orderBy)
                    .where(orderBy, '>=', search)
                    .where(orderBy, '<=', search + '\uf8ff')
                    .startAt(first.docs[first.docs.length - 1].data()[orderBy])
                    .limit(Number(pageSize))
                    .get();

                postsData.forEach(doc => {
                    post = doc.data();
                    post.id = doc.id;
                    postsArray.push(post); // push to postsArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of post.",
                posts: postsArray,
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
            });
        }
    },

    getAllPostPublic: async (req, res) => {
        try {

            let { pageSize, currentPage, search, orderBy } = req.query;

            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            search = search
            orderBy = orderBy || 'title'

            // Get size all user and on page
            postSize = await PostModel._collectionRef
                .where('status', '==', 'public')
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .get();

            let totalItem = postSize.size || 0;
            let totalPage = Math.ceil(postSize.size / pageSize) || 0

            // define posts array
            var postsArray = [];
            // get posts data from firestore
            var postsData;

            first = await PostModel._collectionRef
                .where('status', '==', 'public')
                .orderBy(orderBy)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                postsData = await PostModel._collectionRef
                    .where('status', '==', 'public')
                    .orderBy(orderBy)
                    .where(orderBy, '>=', search)
                    .where(orderBy, '<=', search + '\uf8ff')
                    .startAt(first.docs[first.docs.length - 1].data()[orderBy])
                    .limit(Number(pageSize))
                    .get();

                postsData.forEach(doc => {
                    post = doc.data();
                    post.id = doc.id;
                    postsArray.push(post); // push to postsArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of post.",
                posts: postsArray,
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
            });
        }
    },

    getAllPostByAuthor: async (req, res) => {
        try {

            let { pageSize, currentPage, search, orderBy, authorID } = req.query;

            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            search = search
            orderBy = orderBy || 'title'
            authorID = authorID

            // Get size all user and on page
            postSize = await PostModel._collectionRef
                .where('authorID', '==', authorID)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .get();

            let totalItem = postSize.size || 0;
            let totalPage = Math.ceil(postSize.size / pageSize) || 0

            // define posts array
            var postsArray = [];
            // get posts data from firestore
            var postsData;

            first = await PostModel._collectionRef
                .where('authorID', '==', authorID)
                .orderBy(orderBy)
                .where(orderBy, '>=', search)
                .where(orderBy, '<=', search + '\uf8ff')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                postsData = await PostModel._collectionRef
                    .where('authorID', '==', authorID)
                    .orderBy(orderBy)
                    .where(orderBy, '>=', search)
                    .where(orderBy, '<=', search + '\uf8ff')
                    .startAt(first.docs[first.docs.length - 1].data()[orderBy])
                    .limit(Number(pageSize))
                    .get();

                postsData.forEach(doc => {
                    post = doc.data();
                    post.id = doc.id;
                    postsArray.push(post); // push to postsArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of post.",
                posts: postsArray,
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
            });
        }
    },

    getAllPostByAuthorID: async (req, res) => {
        try {
            // get post data from firestore
            var postData = await PostModel.getAllBy(`authorID`, `${req.query.authorID}`);
            // if not exist
            if (!postData)
                return res.status(404).json({
                    success: false,
                    message: `post not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `get all post by author id.`,
                posts: postData
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

    getPostByID: async (req, res) => {
        try {
            // get post data from firestore
            var postData = await PostModel.getById(`${req.query.id}`);
            // if not exist
            if (!postData)
                return res.status(404).json({
                    success: false,
                    message: `post not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of post '${postData.tittle}.'`,
                post: postData
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

    getLastPosts: async (req, res) => {
        try {
            // take by amount in query param or not default 1
            let amount = 1;
            if (req.query.amount) {
                amount = parseInt(req.query.amount);
            }
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef.orderBy('dateCreated', 'desc').limit(amount).get();
            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })
            return res.status(200).json({
                success: true,
                message: `data of post`,
                posts: postsArray
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

    getLastPostsByAuthorID: async (req, res) => {
        try {
            // take by amount in query param or not default 1
            let { amount, authorID } = req.query;
            amount = amount | 1;
            if (!authorID)
                throw new Error('author id required.');
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef
                .orderBy('dateCreated', 'desc')
                .where('authorID', '==', authorID)
                .limit(amount).get();
            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })
            return res.status(200).json({
                success: true,
                message: `data of post`,
                posts: postsArray
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

    getFeaturedPosts: async (req, res) => {
        try {
            // take by amount in query param or not default 1
            let amount = 1;
            if (req.query.amount) {
                amount = parseInt(req.query.amount);
            }
            // take by month ago in query param or not default 1
            let monthago = 1;
            if (req.query.monthago) {
                monthago = parseInt(req.query.monthago);
            }
            // define time month ago
            var monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - monthago);
            console.log(monthAgo.toISOString())
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef
                .orderBy('dateCreated', 'desc')
                .orderBy('likesCount', 'desc')
                .orderBy('averageRating', 'desc')
                .where('dateCreated', '>', monthAgo.toISOString())
                .limit(amount).get();
            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })
            return res.status(200).json({
                success: true,
                message: `data of post`,
                posts: postsArray
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

    getRecommendedPosts: async (req, res) => {
        try {
            // get param from query request
            let { amount, userID } = req.query;
            amount = amount | 1; // if not exists => 1
            if (!userID) // require user ID
                throw new Error('post id and user id required.');

            // get history viewed post from user ID
            var viewedPostID = (await PostsHistoryModel.getBy('userID', `${userID}`))._data.viewedPosts.slice(-5);
            console.log(viewedPostID.length);

            // get viewed post user
            viewedPost = await PostModel._collectionRef
                .orderBy('dateCreated', 'desc')
                .where('id', 'in', viewedPostID)
                .get();

            // create string to recommented posts
            viewedPostsString = ''
            viewedPost.forEach(doc => {
                item = doc.data()
                document = ''.concat(item.category, " ", // category
                    item.mainColor.join(' '), " ", // mainColor
                    item.pattern.join(' '), " ", // pattern
                    item.title, " ", // title
                    item.displayNameAuthor) // displayNameAuthor
                viewedPostsString = viewedPostsString.concat(document, " ") // concat to des string 
            })

            // define posts array get
            var postsArray = [];

            // get post data from firestore to calculat vector
            var postsData = await PostModel._collectionRef
                .where('id', 'not-in', viewedPostID)
                .limit(100).get();

            TfIdf = natural.TfIdf, tfidf = new TfIdf();
            var ArrObject = []

            // add document to tfidf
            postsData.forEach(doc => {
                item = doc.data()
                item.id = doc.id;
                postsArray.push(item) // add to data return
                document = ''.concat(item.category, " ",
                    item.mainColor.join(' '), " ",
                    item.pattern.join(' '), " ",
                    item.title, " ", item.displayNameAuthor)
                // add document
                tfidf.addDocument(removeVietnameseTones(document).toLocaleLowerCase())
            })

            // calculate
            tfidf.tfidfs(removeVietnameseTones(viewedPostsString).toLocaleLowerCase(), function (i, measure) {
                var ob = new ObTFIDF(id = postsArray[i].id, weights = measure)
                ArrObject.push(ob);
            });
            // sort with weights
            ArrObject = ArrObject.sort((a, b) => parseFloat(b.weights) - parseFloat(a.weights))

            // amout post get
            amount = (amount < postsArray.length) ? amount : postsArray.length;

            let results = []
            for (let index = 0; index < amount; index++) {
                results.push(postsArray[postsArray.findIndex(post => post.id === ArrObject[index].id)])
            }

            return res.status(200).json({
                success: true,
                message: `data of post`,
                posts: results
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

    update: async (req, res) => {
        try {
            // get post data from firestore
            var postData = await PostModel.getById(`${req.query.id}`);
            console.log(req.query.id);
            // if not exist
            if (!postData)
                return res.status(200).json({
                    success: false,
                    message: `post not exist.`,
                });
            // if exist, change post data
            postData._data = Object.assign(postData._data, req.body);
            delete postData._data.pid;
            // update to firestore
            await postData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `post '${postData._data.tittle}' updated successfully.`
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

    delete: async (req, res) => {
        try {
            // get post data from firestore
            var postData = await PostModel.getById(`${req.query.id}`);
            // if not exist
            if (!postData)
                return res.status(200).json({
                    success: false,
                    message: `post not exist.`,
                });
            // delete post data on firestore
            await postData.delete();
            return res.status(200).json({
                success: true,
                message: `post '${postData.tittle}' deleted successfully.`,
            })
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