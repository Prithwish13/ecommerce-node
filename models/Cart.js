// const {DataTypes} = require ('sequelize');
// const sequelize = require('../util/dataBase');

// const Cart =  sequelize.define('cart',{
//     id:{
//         type:DataTypes.INTEGER,
//         primaryKey:true,
//         autoIncrement:true,
//         unique:true,
//         allowNull:false
//     },
// })

// module.exports=Cart;






// //-->for saving inside a file
// // const { json } = require('body-parser');
// // const { Console } = require('console');
// // const fs = require('fs');
// // const path = require('path');
// // const main =require.main

// // const p = path.join(path.dirname(main.filename),"data",'cart.json');

// // const getCartItems=(cb)=>{
// //     fs.readFile(p,(err,fileContent)=>{
// //         if(err){
// //             cb([])
// //         }
// //         cb(JSON.parse(fileContent));
// //     })
// // }

// // module.exports= class Cart {
// //    static addProduct(id,productPrice) {
// //         fs.readFile(p,(err,fileContent)=>{
// //             let cart={
// //                 products:[],
// //                 totalPrice:0,
// //             }
// //             if(!err){
// //               cart=JSON.parse(fileContent)
// //             }
// //            const existingProductIndex= cart.products.findIndex(prod=>prod.id===id) 
// //            const existingProduct=cart.products[existingProductIndex]
// //            let updatedProducts;
// //            if(existingProduct){
// //                 updatedProducts={...existingProduct};
// //                 updatedProducts.qty=updatedProducts.qty+1;
// //                 cart.products=[...cart.products];
// //                 cart.products[existingProductIndex]=updatedProducts
// //            }else{
// //                updatedProducts={
// //                    id:id,
// //                    qty:1
// //                }
// //                cart.products=[...cart.products,updatedProducts]
// //            }
// //            cart.totalPrice=cart.totalPrice + (+productPrice)
// //            fs.writeFile(p,JSON.stringify(cart),err=>{
// //                console.log(err);
// //            })
// //         })
// //    }

// //    static deleteProduct(id,productPrice) {
// //        getCartItems(cartItems=>{
          
// //            if(cartItems.length<1){
// //                return;
// //            }
// //             const updatedCart = {...cartItems}
// //             console.log(updatedCart);
// //             const selecteditem = updatedCart.products.find(item=>item.id===id)
// //             if(!selecteditem){
// //                 return;
// //             }
// //             const productQty = +selecteditem.qty;
// //             updatedCart.products= updatedCart.products.filter(product=>product.id !== id)
// //             updatedCart.totalPrice= +updatedCart.totalPrice - (+productPrice * productQty)

// //             fs.writeFile(p,JSON.stringify(updatedCart),err=>console.log(err))
// //        })
// //    }

// //    static fetchCartItems(cb) {
// //        getCartItems(cb)
// //    }
// // }