const jsonwebtoken = require('jsonwebtoken');
const { HttpError } = require('./ErrorHandlingService');

/**
 * @private
 */
async function verify(token) {
    return jsonwebtoken.verify(token, process.env.SERVER_JWT_SECRET);
}

const AUTHORIZATION_HEADER = "Authorization",
    AUTHORIZATION_TYPE = "Bearer";

exports.AUTHORIZATION_HEADER = AUTHORIZATION_HEADER;
exports.AUTHORIZATION_TYPE = AUTHORIZATION_TYPE;

exports.sign = function(data, claims = []) {
    return jsonwebtoken.sign({
        ...data, claims,
        expiresAt: Date.now() + Number(eval(process.env.SERVER_JWT_EXPIRY_TIME_MINUTES)) * 60 * 1000
    }, process.env.SERVER_JWT_SECRET);
}

exports.authorize = function(request, response, next) {
    const header = request.get(AUTHORIZATION_HEADER) || "";

    if(!header) {
        return next(new HttpError("Requested resource has restricted access. Please login.", "Unauthorized", 401));
    }

    const token = header.replace(AUTHORIZATION_TYPE, "").trim();

    try {
        let auth = null;
        
        (async () => {
            auth = await verify(token);

            if(Date.now() > auth.expiresAt) {
                next( new jsonwebtoken.TokenExpiredError("Session is expired. Please login again.", new Date(auth.expiresAt)));
            }
    
            request.auth = auth;
    
            next();
        })();
        
    } catch(error) {
        next(error);
    }
}