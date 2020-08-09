const AbstractRouter = require("./AbstractRouter");
const userDataService = require("../services/UserDataService");
const { HttpError } = require("../services/ErrorHandlingService");
const SecurityHelper = require("../services/SecurityHelper");

class Authentication extends AbstractRouter {
    constructor(userDataService) {
        super("/auth");

        this.userDataService = userDataService;
        this.bindPost("/login", this.login.bind(this));
    }

    static instance = new Authentication(userDataService);

    login({ body: { username, password } }, response) {
        const user = this.userDataService.findByUsername(username);
        
        if(!user || user.password !== password) {
            throw new HttpError("Username and Password does not match", "Unauthorized", 401);
        }

        const authToken = SecurityHelper.sign({ user });

        response.set(SecurityHelper.AUTHORIZATION_HEADER, authToken);

        return { user, authToken };
    }
}

module.exports = Authentication.instance;