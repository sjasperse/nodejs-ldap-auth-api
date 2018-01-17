const _ = require('lodash');
const jwtLibrary = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    create: create,
    verify: verify
};

function create(username, userLdapEntry) {
    var jwtContents = {
        username: userLdapEntry.sAMAccountName,
        displayName: userLdapEntry.displayName,
        mail: userLdapEntry.mail,
        memberOf: _(userLdapEntry).map(group => /CN=([^,]+)/[1]).toArray()
    };

    return jwtLibrary.sign(jwtContents, PRIVATE_KEY);
}

function verify(jwt) {
    try {
        jwtLibrary.verify(jwt, PRIVATE_KEY);
        return true;
    }
    catch (err)
    {
        return false;
    }
}