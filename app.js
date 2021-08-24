const path = require("path");
const { getErr, get500 } = require("./controller/error");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { validationResult } = require("express-validator");
 
// const sequelize =require('./util/dataBase');
// const rootDir = require("./helper/path");


// Importing the models for sql
// const Product  = require('./models/Product');
const User  = require('./models/User');
const MONGODB_URI="mongodb://localhost:27017/Store"
const app = express();
const store = new MongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

const csrfProtection = csrf();

//setting up the DiskStorage
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb) =>{
    if(req.error){
        return cb(null,false);
    }
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
         cb(null,false);
    }
};

//set the templeting engine
//app.set("view engine", "pug");
//set the view engine to handle bars
app.set("view engine", "ejs");
//set that where we use the dynamic content
app.set("views", "views");

const port = 3000;

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require('./routes/auth');
const { get } = require("http");


//-->by using mongodb Driver
// const {getDb,mongoConnect} = require("./util/dataBase");

//=>imports for my sql

// const Cart = require("./models/Cart");
// const CartItem = require("./models/CartItem");
// const Order = require("./models/Order");
// const OrderItem = require("./models/OrderItem");


// db.execute('SELECT * FROM products')
// .then((result)=>{console.log(result)})
// .catch((err)=>console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(session({secret:'prithwishdey',resave:false,
saveUninitialized:false,
store:store
}));

app.use(csrfProtection);
app.use(flash());

//=>used for my sql
// app.use((req,res,next)=>{
//     User.findByPk(1)
//         .then(user=>{
//             req.user=user;
//             next();
//         })
//         .catch(err=>console.log(err));
// })

//-->feching The user at first Time during app is Load
    // app.use((req,res,next)=>{
    //     User.findById("5fe74c7611280b247805f76a")
    //         .then(user=>{
    //             req.user=user;
    //             next();
    //         })
    //         .catch(err=>console.log('user not found'));  
    // })
//-->storing the user from the session to the requset

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req,res,next)=>
    {   
        if(!req.session.user){
            return next();
        }

        User.findById(req.session.user._id)
            .then(user=>{
                if(!user){
                    return next();
                }

                 req.user = user;
                 next();
                 
             })
            .catch(err=>{
              next(new Error(err)); 
            })
        }
);


app.use("/admin", adminData.route);
app.use(shopRoute);
app.use(authRoute);
app.get('/500',get500);
app.use((error,req,res,next)=>{
    res
    .status(500)
    .render("500", { pageTitle: "Error", path:'/500',
      isAuthenticated:req.session.isLoggedIn
  });
});
app.use(getErr);

//=>used for my sql

// Product.belongsTo(User,{
//     constraints:true,
//     onDelete:'CASCADE'
// })
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product,{through:CartItem});
// Product.belongsToMany(Cart,{through:CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through:OrderItem});


//=>used for my sqls
// sequelize.sync()
// // sequelize.sync({force:true})
// .then(response=>{
//    return User.findByPk(1);
// })
// .then(user=>{
//     if(!user){
//         return User.create({name:'abir',email:'Prith@hmail.com',password:'12345'})
//     }
//     return user;
// })
// .then(user=>{
//     return user.createCart();
// })
// .then(cart=>{
//     app.listen(port, () => console.log(`The app is running on port ${port}`));
// })
// .catch(err=>console.log(err));

//-->by using mongodb driver


// mongoConnect(client=>{
//     app.listen(4000,()=>console.log('app is running on 4000'))
// })

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false })
    .then(res=>{
        app.listen(4000);
        console.log('Database connected successfully');
    })
    .catch((err)=>{console.log(err)});