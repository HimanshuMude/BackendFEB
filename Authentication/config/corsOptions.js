const whiteList = ["https://www.google.com", "http://localhost:5000"]
const corsOption = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200
}

module.exports=corsOption;