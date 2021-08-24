//---> for storing  data inside a file.
// const mongodb=require('mongodb');
// const { getDb } = require("../util/dataBase");


// const { json } = require("body-parser");
// const fs = require("fs");
// const path = require("path");
// const main = require.main;
// const {v4} = require('uuid');
// const Cart = require("./Cart");
// const p = path.join(path.dirname(main.filename), "data", "products.json");

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// };

// module.exports = class Product {
//   constructor( title, imageUrl, description, price,id) {
//     this.id=id
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
   
//     getProductsFromFile((products) => {
//       if(this.id){
//       console.log("if block is executing");  
//       const existingProductIndex = products.findIndex(prod=>prod.id===this.id); 
//       console.log(existingProductIndex);
//       const updatedProducts = [...products];
//       updatedProducts[existingProductIndex] = this;
//       console.log(updatedProducts);
//       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         console.log(err);
//       })
//     }else{
//       console.log("else block is executing") 
//       this.id=v4();
//       products.push(this);
//       fs.writeFile(p, JSON.stringify(products), (err) => {
//         console.log(err);
//       });
//     }
//    }
//   )} 

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static findById(id,cb){
//    getProductsFromFile(products=>{
//      const product = products.find(prod=>prod.id === id)
//      cb(product);
//    })
//   }

//   static deleteById(id){
//     getProductsFromFile((products)=>{
//       const newProducts= products.filter(product=>product.id !== id);
//       const selectedProduct = products.find(product=>product.id===id)
//       fs.writeFile(p,JSON.stringify(newProducts),err=>console.log(err))
//       Cart.deleteProduct(id,selectedProduct.price)
//     })
//   }
// };

//--> storing Data in Mysql Database

// const {DataTypes} = require('sequelize');
// const sequelise = require('../util/dataBase');

// const Product= sequelise.define('product',{
//   id:{
//     type:DataTypes.INTEGER,
//     autoIncrement:true,
//     unique:true,
//     primaryKey:true,
//     allowNull:false
//   },
//   title:DataTypes.STRING,
//   price:{
//     type:DataTypes.DOUBLE,
//     allowNull:false,
//   },
//   description:{
//     type:DataTypes.STRING,
//     allowNull:false
//   },
//   imageUrl:{
//     type:DataTypes.STRING,
//     allowNull:false,
//   }
// });

// module.exports=Product;

//---> using mongodb;

// class Product {
//     constructor(title,price,description,imageUrl,id,userId){
//         this.title=title;
//         this.price=price;
//         this.description=description;
//         this.imageUrl=imageUrl;
//         this._id = id ? new mongodb.ObjectID(id) : null;
//         this.userId=userId;
//     }

//     save(){
//         const db = getDb();
//         if(this._id){
//             return db.collection('products').findOneAndUpdate({_id:this._id},{$set:this})
//         }else{
//             return db.collection('products').insertOne(this)
//                  .then((result)=>{
//                 console.log(result);
//                 })
//                  .catch(err=>console.log(err));
//             }
      
//     }

//    static fetchAll(){
//         const db = getDb();
//         return db.collection('products').find().toArray().then(product=>product)
//         .catch(err=>console.log(err));
//     }
//    static fetchById(id){
//         const db = getDb();
//         return db.collection('products').findOne({_id: new mongodb.ObjectID(id)})
//     }
//    static trash(id){
//       const db=getDb();
//       return db.collection('products').findOneAndDelete({_id: new mongodb.ObjectID(id)})
//    }
// }

// module.exports=Product;

//-->by using mongoose
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectID,
        ref:'User',
        required:true
    }
});

module.exports=mongoose.model('Product',ProductSchema);