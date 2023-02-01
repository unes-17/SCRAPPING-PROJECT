const Category = require("../models/category");
const Product = require("../models/product");

const nameSpace = "ProductController";
//get All products
exports.getaAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category")
            .sort([['name', 'asc']]);

        return res.status(200).send(products);
    } catch (error) {
        console.log("Error in : " + nameSpace + " Error :" + error);
    }
};

//get all Catgories
exports.getAllCatgeories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).send(categories);
    } catch (error) {
        console.log("Error in : " + nameSpace + " Error :" + error);
    }
};

//get a product by categoryId
exports.getaProductsByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params
        const category = await Category.find({ _id: categoryId });
        if (!category) {
            return res.status(404).send("Category not found");
        }
        const products = await Product.find({
            category: { _id: categoryId },
        }).populate("category");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error in : " + nameSpace + " Error :" + error);
    }
};
