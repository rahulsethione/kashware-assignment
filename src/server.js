require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authenticationRouter = require("./routes/Authentication");
const protectedResRouter = require("./routes/ProtectedResources");
const userDataRouter = require("./routes/UserData");
const { errorHandlingMiddleware } = require('./services/ErrorHandlingService');

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cors());
app.use(errorHandlingMiddleware);

app.get("/try", (req, res) => {
    res.json({data: "test"})
})

authenticationRouter.attachAppServer(app);
protectedResRouter.attachAppServer(app);
userDataRouter.attachAppServer(app);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Node.js server running at http://localhost:" + process.env.SERVER_PORT);
});