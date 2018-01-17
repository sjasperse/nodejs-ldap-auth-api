const LDAP_PATH = process.env.LDAP_PATH;
const LDAP_DN = process.env.LDAP_DN;
const LDAP_PASSWORD = process.env.LDAP_PASSWORD;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;
const LDAP_SEARCH_BASE_DN = process.env.LDAP_SEARCH_BASE_DN;

let ldap = require('ldapjs');
let jwtManager = require('../jwtManager.js');
let ldapClient = ldap.createClient({ url: LDAP_PATH });

ldapClient.bind(LDAP_DN, LDAP_PASSWORD, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    else {
        console.log('LDAP connection bound');
    }
});

var validateCredentials = function (username, password) {
    return new Promise((fulfill, reject) => {
        ldapClient.search(LDAP_SEARCH_BASE_DN, { filter: `(sAMAccountName=${username})`, scope: 'sub' }, function(err, ldapRes) {
            if (err) {
                reject(err);
            }

            var userEntry = null;

            ldapRes.on('searchEntry', function(entry) {
                console.log('on', entry);
                userEntry = userEntry || entry.object;
            });
            ldapRes.on('error', function(err) {
                console.log('error', err);
                reject(err);
            });
            ldapRes.on('end', function(res) {
                console.log('end', res);
                if (userEntry) {
                    var subClient = createLdapClient();
                    subClient.bind(userEntry.dn, password, (err) => {
                        fulfill({ success: !!!err, userEntry: userEntry });
                    });
                }
                else {
                    fulfill(false);
                }
            });
        });
    });
};

module.exports = (app) => {
    app.post('/authenticate', (req, res) => {

        if (req.body && req.body.username) {
            validateCredentials(req.body.username, req.body.password)
                .then((r) => {
                    var result = { success: r.success };
                    console.log(r);
                    console.log(result);
                    
                    if (r.success) {
                        var jwt = jwtManager.create(req.body.usename, r.userEntry);
                        res.cookie(
                            AUTH_COOKIE_NAME, 
                            jwt,
                            {
                                httpOnly: true,
                                secure: true
                            });

                        result.jwt = jwt;
                    }

                    res.send(result);
                })
                .catch((err) => {
                    console.error(err);
                    res.sendStatus(500);
                });

            return;
        }

        res.status('400').send('Bad Request. Expected username and password in body.');
    });
};