const fs=require('fs');
const path=require('path');
const rs=fs.createReadStream(path.join(__dirname,'res',"lorem.txt"),{encoding:'utf-8'});
const ws=fs.createWriteStream(path.join(__dirname,'res','new-lorem.txt'));

/* rs.on('data',(data)=>{
    ws.write(data)
});
 */

rs.pipe(ws);