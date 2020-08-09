
const { resolve } = require("path");
const AbstractRouter = require("./AbstractRouter");
const SecurityHelper = require("../services/SecurityHelper");

class ProtectedResources extends AbstractRouter {
    constructor() {
        super(
            "/resources/protected",
            SecurityHelper.authorize,
            AbstractRouter.serverStatic(resolve(__dirname, "../resources"))
        );
    }

    static instance = new ProtectedResources();

    /**
     * @override
     */
    attachAppServer(app) {
        app.use(this.path, this.middleware);
    }
}

module.exports = ProtectedResources.instance;