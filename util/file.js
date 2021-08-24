const fs = require('fs');


exports.removeFile=(filePath)=>{
    return fs.unlink(filePath,(err)=>{
        if(err){
            throw new Error('unable to Delete the file');
        }
    })
}   