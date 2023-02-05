const { logEvents } = require("./event");

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}:${err.message}`, 'errLog.txt');
    console.error(err);
    res.status(500).send("Not allowed by CORS");
};

module.exports = errorHandler;