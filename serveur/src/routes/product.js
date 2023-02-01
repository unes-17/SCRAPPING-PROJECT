const express = require("express");

const router = express.Router();

const {
    getAllCatgeories,
    getaProductsByCategoryId,
    getaAllProducts,
} = require("../controllers/productController");

//router get all Products
router.get("/allProducts", getaAllProducts);

//get Product by Category
router.get("/allProducts/:categoryId", getaProductsByCategoryId);

//get all Ctaegories
router.get("/allCategories", getAllCatgeories);

module.exports = router;