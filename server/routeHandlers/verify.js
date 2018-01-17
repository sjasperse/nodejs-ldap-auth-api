const jwtManager = require('../jwtManager.js');
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;

module.exports = function (app) {
    app.get('/verify', (req, res) => {

        var jwt = null;

        // first, get it from the headers
        if (!jwt) {
            var authorization = req.get('authorization');
            if (authorization) {
                jwt = authorization.split(' ')[1];
            }
        }

        // second, try to get it from the cookies
        if (!jwt) {
            jwt = req.cookies[AUTH_COOKIE_NAME];
        }

        var result = {
            success: false
        };

        try {
            result.success = jwtManager.verify(jwt);
        }
        catch (err) {
            result.success = false;
            console.log(err);
        }

        res.send(result);
    });
};