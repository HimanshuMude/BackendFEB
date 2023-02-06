const express = require('express');
const app = express();
const path = require('path');
const { logEvents, logger } = require('./middleware/event');
const errorHandler = require("./middleware/errorHandler");
const fs = require('fs');
const cors = require('cors');
const corsOption=require('./config/corsOptions')
const PORT = process.env.PORT || 5000;

//custom middleware

app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//serve static files
app.use('/',express.static(path.join(__dirname, '/public')));

//routes
app.use('/',require('./routes/root'));
app.use('/employees',require('./routes/api/employees'))

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

    
    
    // //Route Handler
    // app.get('/hello(.html)?', (req, res, next) => {
    //     console.log('Attempt to access Hello.html');
    //     next();
    // }, (req, res) => {
    //     res.send("Hello World!");
    // })
    
    
    // //chaining route handlers
    
    // const one = (req, res, next) => {
    //     console.log("one");
    //     next();
    // }
    
    // const two = (req, res, next) => {
    //     console.log('two');
    //     next();
    // }
    
    // const three = (req, res, next) => {
    //     console.log("three");
    //     res.send("Finished!!!");
    // }
    
    // app.get('/chain(.html)?', [one, two, three]);
    
    // app.get('/*', (req, res) => {
    //     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    // })