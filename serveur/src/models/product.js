const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: "string",
        },
        url: {
            type: "string",
        },
        image_url: {
            type: "string",
        },
        price: {
            type: "string",
        },
        brand: {
            type: "string",
        },
        availability: {
            type: "string",
        },
        delivery: {
            type: "string",
        },
        specifications: [
            {
                key: {
                    type: "string",
                },
                value: {
                    type: "string",
                },
            },
        ],
        category: {
            type: ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);