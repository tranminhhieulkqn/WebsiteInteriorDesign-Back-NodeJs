exports.getWelcomeMessage = function (req, res) {
    console.log(req.url);
    res.json({ statusCode: 200, success: true, message: "Welcome to Node API" });
};