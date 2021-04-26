var mongoose = require('mongoose');

/**
 * Define table User in database.
 */
var PostSchema = new mongoose.Schema({
    authorID: { type: String, required: true },
    tittle: { type: String, required: true, minLength: 10 },
    imageURL: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    sumary: { type: String, required: true, minLength: 10, maxLenth: 200 },
    content: { type: String, required: true },
    category: { type: String, required: true },
    keywords: { type: String, required: true, default: '' },
    isPublic: { type: Boolean, required: true, default: false },
    numOfLikes: { type: Number, default: 0 }
});

/**
 * Sample json to create Post
    Method: POST
    {
        "authorID": "6082815db8de82110c0bd714",
        "tittle": "Angular la mot framwork hoat dong rat OK",
        "imageURL": "https://images.unsplash.com/photo-1523215108660-3fdf7932d7a5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=745&q=80",
        "sumary": "Test ne nha! Coi ky nha!",
        "content": "Chao moi nguoi tao ten la Hieu! Test thoi a!",
        "likesID": "likesID",
        "numOfLikes": 0,
        "commentsID": "commentsID",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnZW5kZXIiOnRydWUsInJvbGUiOiJhZG1pbiIsIl9pZCI6IjYwODI4MTVkYjhkZTgyMTEwYzBiZDcxNCIsImZpcnN0TmFtZSI6IlRyYW4gTWluaCIsImxhc3ROYW1lIjoiSGlldSIsImJpcnRoRGF0ZSI6IjE5OTktMTAtMjdUMDA6MDA6MDAuMDAwWiIsInVzZXJuYW1lIjoidHJhbm1pbmhoaWV1bGsiLCJwYXNzd29yZCI6IiQyYSQxMCQyc1pyQXVRYUZXaWVteS9xSEtLbVJPbEFYVGJ3Qm1EMEVkczF0eUJ2VDNwc2ZvOFM3MGpSNiIsInBob25lIjoiMDM1NDE3NjI5MyIsImVtYWlsIjoidHJhbm1pbmhoaWV1bGtxbl9AZ21haWwuY29tIiwiYWRkcmVzcyI6IkR1YyBMb2ksIE1vIER1YywgUXVhbmcgTmdhaSIsIl9fdiI6MCwiaWF0IjoxNjE5MTY2MTAyLCJleHAiOjE2MTkyNTI1MDJ9.95CAg8g1BaoiCoVQ873xTieBqdqZcOelJ8Mv_mGW5SQ"
    }
 */

/**
 * Make this available to our posts in our Node applications
 */
module.exports = mongoose.model('Post', PostSchema);