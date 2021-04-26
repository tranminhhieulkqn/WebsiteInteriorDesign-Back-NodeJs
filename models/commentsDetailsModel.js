var mongoose = require('mongoose');

/**
 * Define table CommentsDetails in database.
 */
var CommentsDetailsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdDate: { type: Date, required: true, default: Date.now },
    postID: { type: String, required: true },
    authorID: { type: String, required: true }
});

/**
 * Sample json to create commentsDetails
    Method: POST
    {
        "content": "Mau nay rat OK!",
        "createdDate": Date.now, // auto
        "postID": "idofpost"
        "authorID": "6082815db8de82110c0bd714",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnZW5kZXIiOnRydWUsInJvbGUiOiJhZG1pbiIsIl9pZCI6IjYwODI4MTVkYjhkZTgyMTEwYzBiZDcxNCIsImZpcnN0TmFtZSI6IlRyYW4gTWluaCIsImxhc3ROYW1lIjoiSGlldSIsImJpcnRoRGF0ZSI6IjE5OTktMTAtMjdUMDA6MDA6MDAuMDAwWiIsInVzZXJuYW1lIjoidHJhbm1pbmhoaWV1bGsiLCJwYXNzd29yZCI6IiQyYSQxMCQyc1pyQXVRYUZXaWVteS9xSEtLbVJPbEFYVGJ3Qm1EMEVkczF0eUJ2VDNwc2ZvOFM3MGpSNiIsInBob25lIjoiMDM1NDE3NjI5MyIsImVtYWlsIjoidHJhbm1pbmhoaWV1bGtxbl9AZ21haWwuY29tIiwiYWRkcmVzcyI6IkR1YyBMb2ksIE1vIER1YywgUXVhbmcgTmdhaSIsIl9fdiI6MCwiaWF0IjoxNjE5MTY2MTAyLCJleHAiOjE2MTkyNTI1MDJ9.95CAg8g1BaoiCoVQ873xTieBqdqZcOelJ8Mv_mGW5SQ"
    }
 */

/**
 * Make this available to our commentsDetails in our Node applications
 */
module.exports = mongoose.model('CommentsDetails', CommentsDetailsSchema);