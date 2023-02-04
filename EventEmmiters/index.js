const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./event');
const EventEmmiter = require('events');
const { log, error } = require('console');

class Emmiter extends EventEmmiter { };

const myEmmiter = new Emmiter();
myEmmiter.on('log',(msg,fileName)=>{
    logEvents(msg,fileName);
})
const PORT = process.env.PORT || 5000;


const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    }
    catch (err) {
        myEmmiter.emit('log', `${err.name}:${err.message}`, 'errLog.txt');
        console.error(err);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    myEmmiter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const ext = path.extname(req.url);
    let contentType;

    switch (ext) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }
    let filePath;
    if (contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'views', 'index.html');
    }
    else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, 'views', req.url, 'index.html');
    }
    else if (contentType === 'text/html') {
        filePath = path.join(__dirname, 'views', req.url);
    }
    else {
        filePath = path.join(__dirname, req.url);
    }

    //makes the .html extension not required in browser
    if (!ext && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExist = fs.existsSync(filePath);

    if (fileExist) {
        serveFile(filePath, contentType, res);
    }
    else {
        //404 or 301
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                //serve 404
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);

        }
    }

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', err => {
    console.error(err);
    process.exit(1);
})


// myEmmiter.on('log',(msg)=>{
//     logEvents(msg);
// })

// setTimeout(()=>{
//     myEmmiter.emit('log',"Successfully Logged the event");
// },2000);

















