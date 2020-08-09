const { TokenExpiredError } = require('jsonwebtoken');

class HttpError extends Error {
    constructor(message, statusText, statusCode) {
        super(message);

        this.statusText = statusText;
        this.statusCode = statusCode;
    }
}

exports.HttpError = HttpError;

exports.errorHandlingMiddleware = function(error, request, response, next) {
    if(error instanceof HttpError) {
        return response.status(error.statusCode).json({
            status: error.statusText,
            message: error.message
        }).end();
    }

    if(error instanceof TokenExpiredError) {
        return response.status(error.statusCode).json({
            status: "Unauthorized",
            message: error.message
        }).end();
    }

    next(error);
}