const AbstractRouter = require("./AbstractRouter");
const userDataService = require("../services/UserDataService");
const SecurityHelper = require("../services/SecurityHelper");

class UserData extends AbstractRouter {
    constructor(userDataService) {
        super("/user", SecurityHelper.authorize);

        this.userDataService = userDataService;
        this.bindGet("/self", this.self.bind(this));
        this.bindPut("/self", this.update.bind(this));
        this.bindPatch("/self", this.update.bind(this));
    }

    static instance = new UserData(userDataService);

    self({ auth: { user: { username } } }) {
        return this.userDataService.findByUsername(username);
    }

    update({ body, auth: { user: { username } } }) {
        return this.userDataService.updateForUsername(username, body);
    }

    patch({ body, auth: { user: { username } } }) {
        return this.userDataService.patchForUsername(username, body);
    }
}

module.exports = UserData.instance;