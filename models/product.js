const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name must be provided']
    },
    price: {
        type: Number,
        required: [true, 'product price must be provided']
    },
    featured: {
        type: Boolean,
        required: false
    },
    rating: {
        type: Number,
        required: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "marcos", "caressa"],
            message: "{VALUE} is not supported"
        }
    }
});

module.exports = mongoose.model("Product", productSchema);
