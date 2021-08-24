// --> bu using mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,ref:'Product',
                    required:true
                },
                quantity:{
                    type:Number,required:true
                }
            }
        ]
    }
});

UserSchema.methods.addToCart = function(product){
        const cartProductIndex = this.cart.items.findIndex(cp=>{
           return cp.productId.toString()===product._id.toString();
        })
        let newQuantity = 1;
        const updatedCartItem = [...this.cart.items];
        if(cartProductIndex>=0){
            newQuantity = this.cart.items[cartProductIndex].quantity+1;
            updatedCartItem[cartProductIndex].quantity=newQuantity
            ;
        }else{
            updatedCartItem.push({
                productId:product._id,
                quantity:newQuantity
            });
        };
        const updatedCart = {
            items:updatedCartItem
        };
        this.cart = updatedCart;
        return this.save();
}

UserSchema.methods.removeFromCart=function(prodId){
    const updatedCartItem = this.cart.items.filter(product=>product.productId.toString()!==prodId.toString());
    this.cart.items=updatedCartItem;
    return this.save();
}

UserSchema.methods.clearCart = function (params) {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User',UserSchema);


// for mySql use
// const sequelise= require('../util/dataBase');
// const {DataTypes} = require ('sequelize');

// const User = sequelise.define('user',{
//     id:{
//         type:DataTypes.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true,
//         unique:true 
//     },
//     name:{
//         type:DataTypes.STRING,
//         allowNull:false,
//     },
//     email:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         unique:true
//     }
// })

// module.exports=User;

//using mongoDb

// const { getDb } = require("../util/dataBase");
// const mongodb = require('mongodb')

// class User {
//     constructor(userName,email,cart,id){
//         this.name=userName;
//         this.email=email;
//         this.cart=cart;
//         this._id=id;
//     }
//     save(){
//         const db=getDb();
//         return db.collection('users').insertOne(this)
//     }
//     addToCart(product){
//         const db = getDb();
//         const cartProductIndex = this.cart.item.findIndex(cp=>{
//            return cp.productId.toString()===product._id.toString();
//         })
//         let newQuantity = 1;
//         const updatedCartItem = [...this.cart.item];
//         if(cartProductIndex>=0){
//             newQuantity = this.cart.item[cartProductIndex].quantity+1;
//             updatedCartItem[cartProductIndex].quantity=newQuantity
//             ;
//         }else{
//             updatedCartItem.push({
//                 productId:new mongodb.ObjectID(product._id),
//                 quantity:newQuantity
//             });
//         };
//         const updatedCart = {
//             item:updatedCartItem
//         };
//        return db.collection('users').findOneAndUpdate({_id: new mongodb.ObjectID(this._id)},{$set:{cart:updatedCart}})

//     }

//     addOrder(){
//        const db = getDb();
//       return this.fetchCart()
//             .then(product=>{
//                 const order = {
//                     item:product,
//                     user:{
//                         _id: new mongodb.ObjectID(this._id),
//                         name:this.name
//                     }
//                 }
//                  return db.collection('orders').insertOne(order)
//              })
//              .then(result=>{
//                             this.cart ={item:[]}
//                             return db.collection('users')
//                                .findOneAndUpdate(
//                                    {_id: new mongodb.ObjectID(this._id)},
//                                    {$set:{cart:{item:[]}}}
//                                )
//                     })
            
//             .catch(err=>console.log('not able to update'))
//     }

//     getOrder(){
//         const db=getDb();
        
      
//            return db.collection('orders').find({'user._id':new mongodb.ObjectID(this._id)}).toArray()
                                              
                     
       
//     }

//     fetchCart(){
//         const db = getDb();
//         const productIds = this.cart.item.map(i=>{
//             return i.productId
//         });
//         return db.collection('products').find({_id:{$in:productIds}}).toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return {
//                     ...p,
//                     quantity:this.cart.item.find(i=>{
//                         return i.productId.toString()===p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//     }

//     deleteFromCart(id){
//         const db = getDb();
//         const updatedCart={item:this.cart.item.filter(items=>items.productId.toString()!==id.toString())};
//         return db.collection('users').findOneAndUpdate({_id: new mongodb.ObjectID(this._id)},{$set:{cart:updatedCart}})
//     }

//     static findById (id) {
//         const db=getDb();
//         return db.collection('users')
//                  .findOne({_id: new mongodb.ObjectID(id)})
//     }
// }

//  module.exports=User;