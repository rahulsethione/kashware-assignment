const { apply_patch } = require("jsonpatch");

/**
 * Mock Data
 * @private
 */
const USER_DATA_SRC = [{
    username: "rahulsethione@gmail.com",
    password: "plaintext",
    name: "Rahul Sethi",
    phone: "9953885588",
    city: "Gurgaon",
    designation: "Senior Associate",
    skills: ["JavaScript", "React.js", "Node.js", "Angular", "Java", "MongoDB", "SQL"]
}, {
    username: "manager@gmail.com",
    password: "password",
    name: "Manager",
    phone: "9953885588",
    city: "Gurgaon",
    designation: "Project Manager",
    skills: ["Excel", "Powerpoint", "Statistics"]
}];

const USER_DATA_SRC_INDEX = new Map(USER_DATA_SRC.map(user => [user.username, user]));

class UserDataService {
    constructor(dataSource, indexedDataSource) {
        this.dataSource = dataSource;
        this.indexedDataSource = indexedDataSource;
    }

    static instance = new UserDataService(USER_DATA_SRC, USER_DATA_SRC_INDEX);

    findByUsername(username) {
        return this.indexedDataSource.get(username);
    }

    updateForUsername(username, update) {
        const doc = this.indexedDataSource.get(username);
        Object.assign(doc, update);
        this.indexedDataSource.set(username, doc);
        return doc;
    }

    patchForUsername(username, patch) {
        const doc = this.indexedDataSource.get(username);
        const patchedDoc = apply_patch(doc, patch);
        const index = this.dataSource.findIndex(user => user.username === username);

        this.dataSource.splice(index, 1, patchedDoc);
        this.indexedDataSource.set(username, patchedDoc);

        return patchedDoc;
    }

}

module.exports = UserDataService.instance;