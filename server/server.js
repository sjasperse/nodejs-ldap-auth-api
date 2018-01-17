var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

app.use(function (req, res, next) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
    console.log(`Response: ${req.method} ${req.url} Status: ${res.statusCode}`);
});

app.use(require('cookie-parser')());
app.use(require('body-parser').json());

require('./routeHandlers/authenticate.js')(app);
require('./routeHandlers/verify.js')(app);
require('./routeHandlers/ping.js')(app);

app.listen(3000, '0.0.0.0', function () {
    console.log('Listening on port 3000');
});

process.on('SIGTERM', () => {
    console.log('caught sigterm. Exiting');
    process.exit(1);
});
