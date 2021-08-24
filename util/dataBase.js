// const mysql = require('mysql2');

// const pool=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node_complete',
//     password:'Prith@1996'
// });

// module.exports=pool.promise();

//---> for my sql uses 

// const {Sequelize} = require ('sequelize');

// const sequelize = new Sequelize('node_complete','root','Prith@1996',{
//     dialect:'mysql',
//     host:'localhost'
// });

// module.exports =sequelize;

const mongodb=require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect =(cb)=>{
    MongoClient.connect("mongodb://localhost:27017/Store", { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result=>{
     _db=result.db();
     cb(result);
})
    .catch(err=>console.log(err));
}

const getDb=()=>{
    if(_db){
        return _db
    }
    throw "No data Found"
}


exports.mongoConnect=mongoConnect;
exports.getDb=getDb