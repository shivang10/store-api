const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'product name must be provided']
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: [true, 'product price must be provided']
    },
    discountPercentage: {
        type: Number,
        required: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    stock: {
        type: Number,
        required: [true, 'product quantity must be there']
    },
    brand: {
        type: String,
        required: [true, 'product brand should be there']
    },
    category: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Product", productSchema);
