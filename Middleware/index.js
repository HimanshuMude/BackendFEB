const express = require('express');
const app = express();
const path = require('path');
const { logEvents, logger } = require('./middleware/event');
const errorHandler = require("./middleware/errorHandler");
const fs = require('fs');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

//custom middleware

app.use(logger);

//Cross Origin Resource Sharing
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
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');//by default send a 302
})

//Route Handler
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempt to access Hello.html');
    next();
}, (req, res) => {
    res.send("Hello World!");
})


//chaining route handlers

const one = (req, res, next) => {
    console.log("one");
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res, next) => {
    console.log("three");
    res.send("Finished!!!");
}

app.get('/chain(.html)?', [one, two, three]);

// app.get('/*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// })
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
