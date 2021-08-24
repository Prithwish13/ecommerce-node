const path = require("path");
const {
  fetchProducts,
  getIndex,
  getCart,
  getCheckout,
  getProductId,
  postCart,
  deleteFromCart,
  postOrder,
  getOrder,
  getInvoice
} = require("../controller/shop");
const express = require("express");
const rootDir = require("../helper/path");
const isAuth = require("../middlewere/is-auth");
const router = express.Router();

router.get("/", fetchProducts);
router.get("/product/:productId",getProductId)
router.get("/products", getIndex);
router.get("/cart", isAuth,getCart);
router.post("/cart",isAuth,postCart)
// router.get("/checkout", getCheckout);
router.post("/cart-delete-item",isAuth,deleteFromCart);
router.post("/create-order",isAuth,postOrder)
router.get("/orders",isAuth,getOrder)
router.get("/orders/:orderId",isAuth,getInvoice)

module.exports = router;
