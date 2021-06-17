const multer = require('multer')
const router = require('express').Router();
const configs = require('../configs/configs');
const UploadController = require('../controllers/upload.controller')

// define file size max to upload
const fileSizeMax = configs.fileSizeMax
const whiteList = ['image/png', 'image/jpg', 'image/jpeg'];

function getMulter(listFormat = [], isWhiteList = true) {
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: fileSizeMax * 1024 * 1024, // limiting files size
        },
        fileFilter: (req, file, cb) => {
            var allowed = false;
            if ((isWhiteList && listFormat.includes(file.mimetype)) ||
                (!isWhiteList && !listFormat.includes(file.mimetype)))
                allowed = true;
            if (allowed) {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });
}

const uploadImage = getMulter(whiteList, true).single('image');
router.route('/image').post(
    (req, res, next) => {
        uploadImage(req, res, (error) => {
            if (error instanceof multer.MulterError || error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }
            next();// importand!!!
        })
    },
    UploadController.uploadImage);

const uploadImages = getMulter(whiteList, true).array('image');
router.route('/images').post(
    (req, res, next) => {
        uploadImages(req, res, (error) => {
            if (error instanceof multer.MulterError || error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }
            next();
        })
    },
    UploadController.uploadImages);

router.route('/delete')
    .delete(UploadController.deleteFile);

module.exports = router