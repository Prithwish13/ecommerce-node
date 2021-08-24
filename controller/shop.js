const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const fs = require('fs');
const path = require('path');
const { handleError } = require("../errHandler/handelErr");
const PdfDoc = require('pdfkit');

const ITEM_PER_PAGE = 1;

exports.fetchProducts = (req, res) => {
  //res.sendFile(path.join(rootDir, "views", "shop.html"));
  //-->this is implemented for my sql use
  // Product.findAll()
  //   .then(products=>{
  //     res.render("shop/shop", {
  //     prod: products,
  //     pageTitle: "All products",
  //     path: "/",})
  //   })
  //   .catch(err=>console.log(err))

  // const product = new Product;

  // --> by using mongodb driver

  // Product.fetchAll()
  //   .then(products=>{
  //     res.render("shop/shop", {
  //     prod: products,
  //     pageTitle: "All products",
  //     path: "/",})
  //   })
  //   .catch(err=>console.log(err))

  // --> by using mongoose
  const page = +req.query.page || 1;
  let totalItem;
  Product.find().countDocuments()
  .then(totalProducts=>{
    totalItem=totalProducts;
    return Product.find()
           .skip((page-1) * ITEM_PER_PAGE )
           .limit(ITEM_PER_PAGE)
    
  })
  
  .then(products=>{
      res.render("shop/shop", {
      prod: products,
      pageTitle: "All products",
      path: "/",
      currentPage:page,
      hasNextPage:ITEM_PER_PAGE * page < totalItem,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(+totalItem/ITEM_PER_PAGE),
     })
    })
    .catch(err=>console.log(err))

};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItem;
  Product.find().countDocuments()
         .then(productNum=>{
           totalItem=productNum;
            return Product.find()
                  .skip((page-1) * ITEM_PER_PAGE)
                  .limit(ITEM_PER_PAGE)
          })
        .then(products=>{
          res.render("shop/index", {
            prod: products,
            pageTitle: "Shop",
            path: "/products",
            currentPage:page,
            hasNextPage:ITEM_PER_PAGE * page < totalItem,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(+totalItem/ITEM_PER_PAGE),

         });
       })
       .catch(err=>console.log(err));
      };

exports.getCart = (req, res, next) => {

//-->using mongodb  
  if(!req.user){
    res.redirect('/login')
  }

  req.user.populate('cart.items.productId')
          .execPopulate()
          .then(items=>{

            res.render('shop/cart',{
              products:items.cart.items,
              path:'/cart',
              totalPrice:10,
              pageTitle:'Your Cart',
            })
          })
          .catch(err=>console.log(err))
//-->using mysql  
//  req.user.getCart()
//  .then(cart=>{
//    return cart.getProducts()
//               .then(products=>{
//                   products.map(product=>{
//                     console.log(product)
//                   })
//                   res.render("shop/cart", {
//                   products:products,  
//                   totalPrice:10,  
//                   path: "/cart",
//                   pageTitle: "Your cart",
//                 });
//               })
//               .catch(err=>console.log(err))
//  })
//  .catch(err=>console.log(err))  

  // Cart.fetchCartItems(items=>{
  //   const {products,totalPrice}= items;
  //   Product.fetchAll(shopProducts=>{
  //     const cartProducts=[];
  //      for(let product of shopProducts){
  //       const cartProductData= products.find(prod=>prod.id===product.id)
  //       if(cartProductData){
  //         cartProducts.push({product:product,qty:cartProductData.qty});
  //       }
  //      }
  //   console.log(cartProducts)
  //   res.render("shop/cart", {
  //   products:cartProducts,  
  //   totalPrice,  
  //   path: "/cart",
  //   pageTitle: "Your cart",
  // });
  //   })
   
  // })
};

exports.postCart=(req,res,next)=>{
  const prodId=(req.body.productId);
  Product.findById(prodId)
          .then(prod=>{
            return req.user.addToCart(prod)
          })
          .then(result=>{
            console.log(result)
            res.redirect("/cart");
          })
          .catch(err=>console.log(err))

    
  //--> using mySql
  // let fetchedCart;
  // let newQuantity=1;
  // req.user.getCart()
  //    .then(cart=>{
  //      fetchedCart=cart;
  //      return cart.getProducts({where:{id:prodId}})
  //    })
  //    .then(product=>{
  //      let cartProduct
  //      if(product.length>0){
  //         cartProduct=product[0];
  //      }
  //      if(cartProduct){
  //       const oldQuantity= cartProduct.cartItem.quantity;
  //       newQuantity=oldQuantity+1;
  //       return cartProduct;
  //      }
  //      return Product.findByPk(prodId)
  //    })
  //    .then(product=>{
  //       return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
  //    })
  //    .then((data)=>{
  //       res.redirect('/cart')
  //    })
  //    .catch(err=>console.log(err));
 
//   Product.findById(prodId,(product)=>{
//     Cart.addProduct(prodId,product.price);
//  })

  // res.redirect("/cart")
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProductId=(req,res,next)=>{
//--> this is for my sql use 
//  const productId= req.params.productId;
//  Product.findByPk(productId).then(product=>{
//    res.render("shop/productDetail",{
//    path:"/products",
//    pageTitle:"Details",
//    product
//  })
//  }).catch(err=>console.log(err))
//--> this is for mongodb use
 const productId= req.params.productId;
 Product.findById(productId).then(product=>{
   res.render("shop/productDetail",{
   path:"/products",
   pageTitle:"Details",
   product,
 })
 })

}

//by using mongoose
exports.deleteFromCart = (req,res,next) =>{
  //console.log(req.body.productId);
    req.user.removeFromCart(req.body.productId)
        .then(result=>{
          res.redirect('/cart')
        })
        .catch(err=>console.log(err))
}

// exports.deleteFromCart=(req,res,next)=>{
  //-->using mongodb
  // req.user.deleteFromCart(req.body.productId)
  //         .then(result=>{
  //           res.redirect('/cart');
  //         })
  //         .catch(err=>console.log(err))
  // req.user.deleteFromCart(productId)
  //         .then(result=>{
  //           res.redirect('/cart');
  //         })
  //         .catch(err=>console.log(err))


  //-->using mySql
  // const {productId,productPrice} = req.body;
  // req.user.getCart()
  //    .then(cart=>{
  //      return cart.getProducts({where:{id:productId}})
  //    })
  //    .then(products=>{
  //       const product=products[0];
  //       return product.cartItem.destroy();
  //    })
  //    .then(result=>{
  //      res.redirect('/cart')
  //    })
  //    .catch(err=>console.log(err));
// }

exports.postOrder=(req,res,next)=>{
  //using mongoDb
  req.user.populate('cart.items.productId')
     .execPopulate()
     .then(user=>{
       const products = user.cart.items.map(p=>{
         return {
           quantity:p.quantity,
           productData:{...p.productId._doc}
         }
       })
       const order = new Order({
            user:{
              email:req.user.email,
              userId:req.user
            },
            products:products
            }
            ); 
       return order.save();  
   })
     .then(result=>{
            req.user.clearCart()
               .then(result=>{
                  res.redirect('/cart')
               })
            
      })
     .catch(err=>console.log(err));


  //-->using mySql
  // let product;
  // let fetchedCart;
  // req.user.getCart()
  //    .then(cart=>{
  //      fetchedCart=cart;
  //      return cart.getProducts();
  //    })
  //    .then(products=>{
  //      product=products
  //     return req.user.createOrder();
  //    })
  //    .then(order=>{
  //      return order.addProducts(product.map(prod=>{
  //        prod.orderItem={
  //          quantity:prod.cartItem.quantity
  //        }
  //        return prod;
  //      }))
  //    })
  //    .then(result=>{
  //     return fetchedCart.setProducts(null)
       
  //    })
  //    .then(result=>{
  //      res.redirect('/orders')
  //    })
  //    .catch(err=>console.log(err));
}

exports.getOrder=(req,res,next)=>{
  Order.find({'user.userId':req.session.user})
       .then(orders=>{
         console.log(orders);
          res.render('shop/orders',{
               path:'/orders',
               orders:orders,
             
             })
       })
       .catch(err=>{
          console.log(err);
       })  

  // req.user.getOrder()
  //          .then(orders=>{
  //            console.log(orders)
  //            res.render('shop/orders',{
  //              path:'/orders',
  //              orders:orders
  //            })
  //          })

  // req.user.getOrders({include:['products']})
  //   .then(orders=>{
  //     console.log(orders)
  //     res.render("shop/orders",{
  //     path:"/orders",
  //     orders:orders
  // })
  //   })
  //   .catch(err=>console.log(err));
  
}

exports.getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    console.log(orderId);
    Order.findById(orderId)
          .then(order=>{
            if(!order){
              return next (new Error('no order found'));
            };
            if(order.user.userId.toString()!==req.user._id.toString()){
              return next(new Error('un authorized'))
            }
            console.log(order);
            const invoiceName = 'invoice-'+orderId+'.pdf';
            const invoicePath = path.join('invoices',invoiceName);
            console.log(invoicePath);
            let pdf = new PdfDoc();
            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition',`inline; filename=${invoiceName}`);
            // file.pipe(res);
            pdf.pipe(fs.createWriteStream(invoicePath));
            pdf.pipe(res);
            pdf.fontSize(14).text('This is Your Invoice',{
              underline:true
            });
            let totalPrice=0;
            order.products.forEach(prod=>{
              totalPrice+=totalPrice+(prod.productData.price*prod.quantity);
              pdf.text(`${prod.productData.title} - ${prod.quantity} x ${prod.productData.price}`);            
            });
            pdf.text('______________________________')
            pdf.text(`Total Price = ${totalPrice}`);  

            pdf.end();



      //   fs.readFile(invoicePath,(err,data)=>{
      //       if(err){
      //        return next(err);
      //       }
      //      res.setHeader('Content-Type','application/pdf');
      //      res.setHeader('Content-Disposition',`attachment; filename=${invoiceName}`)
      //     res.send(data);
      //  })
      // const file = fs.createReadStream(invoicePath);
     
    })
    .catch(err=>{
      handleError(err,next);
    })
   

};



