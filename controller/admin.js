const Product = require("../models/Product");
const {validationResult}  = require('express-validator');
const { handleError } = require("../errHandler/handelErr");
const mongoose = require("mongoose");
const { removeFile } = require("../util/file");

exports.addProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isLoggedIn,
    errorMessage:null,
    validationError:[],
    oldInp:{
      title:'',
      imageUrl:'',
      description:'',
      price:''
    }
  });
};

//--> re-construct the redirect for mongodb

exports.redirected = (req, res,next) => {
  console.log('Redirect is running'); 
  const errors = validationResult(req);
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image){
    console.log('it is running')
    return res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isLoggedIn,
    errorMessage:'please upload a imageUrl',
    validationError:[],
    oldInp:{
      title,
      description,
      price
    }
  })
  }

  if(!errors.isEmpty()){
    req.error=true
   return res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing:false,
    isAuthenticated:req.session.isLoggedIn,
    errorMessage:errors.array()[0].msg,
    validationError:errors.array(),
    oldInp:{
      
      title,
      image:image.path,
      description,
      price
    }
  })
  }
  const imageUrl = '/'+image.path;
  const product = new Product({
    title:title,
    imageUrl:imageUrl,
    description:description,
    price:price,
    userId:req.user
  });
  product.save()
  .then(result=>{
    console.log('product-created')
    res.redirect('/admin/product-list')
  })
  .catch(err=>{
  //   return res.render("admin/edit-product", {
  //   pageTitle: "Add Product",
  //   path: "/admin/add-product",
  //   editing:false,
  //   isAuthenticated:req.session.isLoggedIn,
  //   errorMessage:'database operation failed,please try again',
  //   validationError:[],
  //   oldInp:{
  //     title,
  //     imageUrl,
  //     description,
  //     price
  //   }
  // })
  // res.redirect('/500');
   return handleError(err,next);
  })
 
};





//--> using mySql
// exports.redirected = (req, res) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;
//   req.user.createProduct({
//     title:title,
//     imageUrl:imageUrl,
//     description:description,
//     price:price,
//     userId:req.user.id
//   })
//   .then(result=>{
//     res.redirect('/admin/product-list')
//   })
//     .catch(err=>console.log(err))
 
// };

exports.editProduct = (req, res,next) => {
  //-->using mySql
  // const productId = req.params.productId;
  // console.log(req.user);
  // req.user.getProducts({where:{id:productId}})
  // .then((products)=>{
  //   console.log(products)
  //   if(!products){
  //     res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //   product:products[0],
  //   path: "/admin/product-list",
  //   editing:true
  // });
  // })
  // .catch(err=>console.log(err)); 

  //-->using mongoDb
   const productId = req.params.productId;
   

   Product.findById(productId)
          .then (product=>{
            if(!product){
             return res.redirect('/');
            }
            if(product.userId.toString()!==req.user._id.toString()){
              return res.redirect('/');
            }

            
              res.render("admin/edit-product", {
              product:product,
              path: "/admin/product-list",
              editing:true,
              isAuthenticated:req.session.isLoggedIn,
              errorMessage:"",
              validationError:[],
              error:false
          });
          })
          .catch(err=>{
            handleError(err,next);
          })
};

exports.postEditProduct=(req,res,next)=>{
  //--> using mySql
  // const {ProductId,description,price,imageUrl,title} = req.body;
  // Product.findByPk(ProductId)
  //   .then(product=>{
  //     product.title=title;
  //     product.price=price;
  //     product.description=description;
  //     product.imageUrl=imageUrl;
  //     return product.save();
  //   }).then(result=res.redirect("/admin/product-list"))
  //     .catch(err=>console.log(err))

  //--> using mongoDb
  const errors = validationResult(req);
  const {ProductId,description,price,title} = req.body;
  const image= req.file;


  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product',{
        path: "/admin/product-list",
              editing:true,
              isAuthenticated:req.session.isLoggedIn,
              errorMessage:errors.array()[0].msg,
              validationError:errors.array(),
              error:true,
              product:{
                title,
                imageUrl,
                price,
                description
              }
    })
  }
  Product.findById(ProductId)
    .then(product => {

      if(product.userId.toString()!==req.user._id.toString()){
        return res.redirect('/')
      }

      product.title=title;
      product.price = price;
      product.description=description;
      

      if(image){
        const actualPath=product.imageUrl.replace('/',"")
        removeFile(actualPath);
        product.imageUrl='/'+image.path;
      }

      product.save()
          .then(result=>{
          console.log('Product has Updated')
          res.redirect('/admin/product-list')
        })
    })
    
    .catch(err=>{
     handleError(err,next);
    })
}

exports.getProducts = (req, res, next) => {
//-->by using mySql
//  req.user
//   .getProducts()
//   .then(products=>{
//     console.log(products);
//     res.render("admin/product-list.ejs", {
//       prod: products,
//       path: "/admin/product-list",
//     })})
//   .catch(err=>console.log("err",err))

//-->by using mongodb
Product.find({userId:req.user._id})
        .populate('userId')
        .then(products=>{
          console.log(products);
           res.render("admin/product-list.ejs", {
           prod: products,
           path: "/admin/product-list",
           isAuthenticated:req.session.isLoggedIn
          })
        })
        .catch(err=>{
          handleError(err,next)
        })


};

exports.deleteProduct=(req,res,next)=>{

  //-->using mongoDb

  const {productId} =req.body;
  //--> by using mongoose

  Product.findById(productId)
         .then(product=>{
           if(product.userId.toString() !== req.user._id.toString()){
             return res.redirect('/');
           }
           product.remove();
           res.redirect("/admin/product-list");
         })
         .catch(err=>{
           handleError(err,next);
         })

  //--> by using mongodb
  // Product.trash(productId)
  //         .then(result=>{
  //           console.log(result)
  //           console.log('product Deleted successfully');
  //           res.redirect("/admin/product-list")
  //         })
  //         .catch(err=>console.log(err))

  //--> using mySql        
  // Product.findByPk(productId)
  //   .then(product=>{
  //     return product.destroy()
  //   }).then(result=>{
  //     console.log('Product Deleted')
  //     res.redirect("/admin/product-list")
  //   })
  //     .catch(err=>console.log(err))
  
}
