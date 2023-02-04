// const fs=require('fs');

// // fs.readFile('./res/simple.txt',(err,data)=>{
// //     if(err) throw err;
// //     console.log(data.toString());
// // })
// fs.readFile('./res/simple.txt','utf8',(err,data)=>{
//     if(err) throw err;
//     console.log(data);
// })


// const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// fs.readFile(path.join(__dirname, 'res', 'lorem.txt'), 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })


// fs.writeFile(path.join(__dirname, 'res', 'lorem.txt'),"Himanshu Mude" ,(err) => {
//     if (err) throw err;
//     console.log("writing into file");
// })
// fs.appendFile(path.join(__dirname, 'res', 'lorem.txt')," h1mu" ,(err) => {
//     if (err) throw err;
//     console.log("appending into file");
// })//can create a file if needed


/* 
fs.writeFile(path.join(__dirname,'res','reply.txt'),'Nice to meet you.',(err)=>{
    if(err) throw err;
    console.log("Completed Writing");
    fs.appendFile(path.join(__dirname,'res','reply.txt'),"\n\n\n Hello Nice to meet you too.",(err)=>{
        if(err) throw err;
        console.log("Append Complete");

        fs.rename(path.join(__dirname, 'res', 'reply.txt'), path.join(__dirname, 'res', 'convo.txt'), (err) => {
            if (err) throw err;
            console.log("Rename Complete");
        })
    })
}) */

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'res', 'simple.txt'), 'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname, 'res', 'simple.txt'));
        await fsPromises.writeFile(path.join(__dirname, 'res', 'newReply.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'res', 'newReply.txt'), '\n\nNice to meet you');
        await fsPromises.rename(path.join(__dirname, 'res', 'newReply.txt'), path.join(__dirname, 'res', 'modReply.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'res', 'modReply.txt'), 'utf8');
        console.log(newData);

    } catch (err) {
        console.error(err);
    }
}

fileOps();

process.on('uncaughtException', err => {
    console.error(err);
    process.exit(1);
})