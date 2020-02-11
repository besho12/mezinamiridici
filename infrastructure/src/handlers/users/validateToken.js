const jwt = require('jsonwebtoken');
const mongo = require('../../utils/mongo.js');
const api = require('../../utils/api.js');

exports.handler = (payload, context, callback) => {
    console.log("handler starts");
    console.log(payload.body);
    const { jwtToken } = JSON.parse(payload.body);
    console.log(jwtToken);
    if (! jwtToken) {
        return api.sendBadRequest(callback, api.createError("Missing user id", "generic.internal-error"));
    }
    const jwtData = jwt.decode(jwtToken);

    // This freezes node event loop when callback is invoked
    context.callbackWaitsForEmptyEventLoop = false;

    mongo.connectToDatabase()
        .then(dbClient => {
            console.log("Mongo connected");
            return mongo.findUser(dbClient, {userId: jwtData.userId}, {projection: { auth: 1 }});
        })
        .then(user => {
            console.log("User checks");
            if (!user) {
                console.log("User not found " + jwtData.userId);
                return api.sendErrorForbidden(callback, api.createError("User does not exist", "sign-in.auth-error"));
            }
            if (jwtData.pwdTimestamp < user.auth.pwdTimestamp) {
                return api.sendErrorForbidden(callback, api.createError("Obsolete password", "sign-in.obsolete-password"));
            }
            return api.sendRresponse(callback, api.createResponse("OK"));
        })
        .catch(err => {
            console.log("Request failed", err);
            return api.sendInternalError(callback, api.createError('Failed to verify token', "generic.something-went-wrong"));
        });
};