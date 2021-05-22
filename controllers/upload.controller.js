const path = require('path');
const { v4 } = require('uuid');
const bucket = require('../services/firebase-admin.services').storage().bucket();

// upload file to firebase storage function
const uploadFileToStorage = async (file, bucketPath = '') => {
    return new Promise((resolve, reject) => {
        // create new ref in firebase storage
        var fileUpload = bucket.file(`${bucketPath}`);
        // creat blob stream for file upload
        const blobStream = fileUpload.createWriteStream({
            gzip: true,
            public: true,
            contentType: file.mimetype,
            metadata: {
                metadata: {
                    // importand: create token to display on firebase storage!!!
                    firebaseStorageDownloadTokens: v4(),
                }
            },
        });
        // catch if error
        blobStream.on("error", (error) => {
            reject(error);
        });
        // when finish, get url file
        blobStream.on("finish", () => {
            // The public URL can be used to directly access the file via HTTP.
            const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(fileURL);
        });
        // end stream concat buffer of file
        blobStream.end(file.buffer);
    });
};

module.exports = {
    uploadImage: async (req, res) => {
        try {
            var file = req.file;
            if (!file)
                return res.status(404).json({
                    success: false,
                    message: `no files found.`,
                });
            // get the bucket path
            var bucketPath = req.body.bucketPath || file.originalname;
            // upload file to firebase storage
            uploadFileToStorage(file, bucketPath)
                .then((fileURL) => { // uploaded successfully
                    return res.status(200).send({
                        success: true,
                        message: 'image uploaded successfully.',
                        imageURL: fileURL
                    });
                })
                .catch((error) => { // upload failed
                    // return error message
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
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

    uploadImages: async (req, res) => {
        try {
            var files = req.files;
            if (!files)
                return res.status(404).json({
                    success: false,
                    message: `no files found.`,
                });
            var numFiles = files.length
            // get the bucket path
            var bucketPath = req.body.bucketPath;
            listImageURL = []
            listError = []
            for (const file of files) {
                // upload file to firebase storage
                await uploadFileToStorage(file, `${bucketPath}/${file.originalname}`)
                    .then((fileURL) => { // uploaded successfully
                        listImageURL.push(fileURL);
                    })
                    .catch((error) => { // upload failed
                        listError.push(`${file.originalname}: ${error.message}`)
                    });
            }
            return res.status(200).send({
                success: true,
                message: 'list image uploaded successfully.',
                imageURL: listImageURL,
                error: listError
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
}