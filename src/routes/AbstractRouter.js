const express = require("express");

class AbstractRouter {
    constructor(path, ...middleware) {
        this.path = path;
        this.middleware = middleware;
        this.router = express.Router();

        this.middleware.forEach(m => this.router.use(m));
    }

    static serverStatic(directory, option = null) {
        return express.static(directory, option);
    }

    attachAppServer(app) {
        app.use(this.path, this.router);
    }

    bindGet(path, handler) {
        console.log("GET " +  this.path + path);
        this.router.get(path, (request, response, next) => {
            try {
                const body = handler(request, response, next);
                response.json(body);
            } catch(error) {
                next(error);
            }
        });
    }

    bindPost(path, handler) {
        console.log("POST " +  this.path + path);
        this.router.post(path, (request, response, next) => {
            try {
                const body = handler(request, response, next);
                return response.json(body).end();
            } catch(error) {
                next(error);
            }
        });
    }

    bindPut(path, handler) {
        console.log("PUT " +  this.path + path);
        this.router.put(path, (request, response, next) => {
            try {
                response.json(handler(request, response, next));
            } catch(error) {
                next(error);
            }
        });
    }

    bindPatch(path, handler) {
        console.log("PATCH " +  this.path + path);
        this.router.patch(path, (request, response, next) => {
            try {
                response.json(handler(request, response, next));
            } catch(error) {
                next(error);
            }
        });
    }
}

module.exports = AbstractRouter;