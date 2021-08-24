const path = require("path");

const express = require("express");
const router = express.Router();

const rootDir = require("../helper/path");
const
    { addProduct,
      redirected,
      getProducts,
      editProduct,
      postEditProduct,
      deleteProduct
 } = require("../controller/admin");
const { route } = require("./shop");
const isAuth = require('../middlewere/is-auth');
const { formValidator } = require("../validations/validate");

//admin get request
// router.get("/add-product", (req, res) => {
//   res.sendFile(path.join(rootDir, "views", "add-product.html"));
// });

router.get("/add-product",isAuth, addProduct);
router.post("/add-product",isAuth,formValidator, redirected);
router.get("/product-list",isAuth, getProducts);
router.get("/edit-product/:productId",isAuth,formValidator,editProduct);
router.post("/edit-product",isAuth,formValidator,postEditProduct);
router.post("/delete-product",isAuth,deleteProduct);

// module.exports = router;

exports.route = router;
//exports.products = products;
