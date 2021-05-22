const router = require('express').Router();

router.route('/')
    .get((req, res) => {
        return res.status(200).json({
            success: true,
            message: "welcome to interior design's api."
        });
    });

module.exports = router;