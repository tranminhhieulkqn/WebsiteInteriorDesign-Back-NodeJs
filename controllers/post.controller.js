const fs = require('fs');
const natural = require('natural');
const PostModel = require('../models/post.model');

function ObTFIDF(id, weights) {
    this.id = id;
    this.weights = weights;
}
TfIdf = natural.TfIdf,
    tfidf = new TfIdf();
var ArrObject = []

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
            let { pageSize, currentPage, search } = req.query;
            pageSize = Number(pageSize)
            currentPage = Number(currentPage)
            // define posts array
            var postsArray = [];
            // get posts data from firestore
            var first;
            var postsData;
            if (pageSize > 0 && currentPage > 0) {
                if (search) {
                    first = await PostModel._collectionRef
                        .orderBy('title')
                        .where('title', '>=', search)
                        .where('title', '<=', search + '\uf8ff')
                        .orderBy('dateCreated', 'desc')
                        .limit(pageSize * (currentPage - 1) + 1)
                        .get();

                    postsData = await PostModel._collectionRef
                        .orderBy('title')
                        .where('title', '>=', search)
                        .where('title', '<=', search + '\uf8ff')
                        .orderBy('dateCreated', 'desc')
                        .startAt(first.docs[first.docs.length - 1].data().dateCreated)
                        .limit(Number(pageSize))
                        .get();
                    console.log(111);
                }
                else {
                    first = await PostModel._collectionRef
                        .orderBy('dateCreated', 'desc')
                        .limit(pageSize * (currentPage - 1) + 1)
                        .get();

                    postsData = await PostModel._collectionRef
                        .orderBy('dateCreated', 'desc')
                        .startAt(first.docs[first.docs.length - 1].data().dateCreated)
                        .limit(Number(pageSize))
                        .get();
                    console.log("pageSize" + pageSize);
                }
            }
            else
                postsData = await PostModel._collectionRef.get();

            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })

            postSize = await PostModel._collectionRef.get();
            let totalItem = postSize.size | 0;
            let totalPage = Math.ceil(postSize.size / pageSize) | 0

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
            // take by amount in query param or not default 1
            let amount = 1;
            if (req.query.amount) {
                amount = parseInt(req.query.amount);
            }
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef.orderBy('dateCreated', 'desc').limit(100).get();


            postsData.forEach(doc => {
                item = doc.data()
                item.id = doc.id;
                postsArray.push(item)
                document = ''.concat(item.category, " ", item.category, " ",
                    item.mainColor.join(' '), " ",
                    item.pattern.join(' '), " ",
                    item.displayNameAuthor, " ", item.displayNameAuthor)
                console.log(document)
                tfidf.addDocument(document)
            })
            tfidf.tfidfs("Interior Design Interior Design Beige-colored Polka Dot Tran Minh Hieu Tran Minh Hieu".toLocaleLowerCase(), function (i, measure) {
                var ob = new ObTFIDF(id = postsArray[i].id, weights = measure)
                ArrObject.push(ob);
            });
            ArrObject = ArrObject.sort((a, b) => parseFloat(b.weights) - parseFloat(a.weights))
            console.log();
            console.log();
            // for (var i = 0; i < postsData.length; ++i) {
            //     item = postsData[i]

            //     document = ''.concat(item.category, " ", item.category, " ",
            //         item.mainColor.join(' '), " ",
            //         item.pattern.join(' '), " ",
            //         item.displayNameAuthor, " ", item.displayNameAuthor)
            //     console.log(document);
            //     // tfidf.addDocument(postsData[i].Interior_type.toLowerCase() + " " + postsData[i].Interior_type.toLowerCase()
            //     //     + " " + removeVietnameseTones(postsData[i].Color.toLowerCase())
            //     //     + " " + removeVietnameseTones(postsData[i].Pattern.toLowerCase())
            //     //     + " " + removeVietnameseTones(databases[i].Designer_name.toLowerCase()) + " " + removeVietnameseTones(databases[i].Designer_name.toLowerCase()));
            // }
            // tfidf.tfidfs(str.toLocaleLowerCase(), function (i, measure) {
            //     var ob = new ObTFIDF(id = databases[i].id, weights = measure)
            //     ArrObject.push(ob);
            // });

            // return ArrObject.sort((a, b) => parseFloat(b.weights) - parseFloat(a.weights))
            // postsData.forEach(doc => {
            //     post = doc.data();
            //     post.id = doc.id;
            //     postsArray.push(post); // push to postsArray
            // })
            return res.status(200).json({
                success: true,
                message: `data of post`,
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