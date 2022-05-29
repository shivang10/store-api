const Product = require("../models/product");
const supportedOperators = require("../utils/operators");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        title: "vase table",
    });
    res.status(200).json({msg: products, nbHits: products.length});
}

const getAllProducts = async (req, res) => {
    const {
        brand, title, sort, price, rating, page = 1,
        limitBy = 10, category, stock, fieldsRequired
    } = req.query;
    let pipeline = []
    const queryObject = {}

    if (brand) {
        queryObject.brand = brand;
    }
    if (title) {
        queryObject.title = title;
    }

    if (category) {
        queryObject.category = category
    }

    if (stock) {
        const operator = stock.replace(/[^A-Za-z]/g, '');
        const value = stock.replace(/^\D+/g, '');
        if (operator in supportedOperators) {
            queryObject.stock = {
                [supportedOperators[operator]]: Number(value)
            }
        }
    }

    if (price) {
        const operator = price.replace(/[^A-Za-z]/g, '');
        const value = price.replace(/^\D+/g, '');
        if (operator in supportedOperators) {
            queryObject.price = {
                [supportedOperators[operator]]: Number(value)
            }
        }
    }

    if (rating) {
        const operator = rating.replace(/[^A-Za-z]/g, '');
        const value = rating.replace(/^\D+/g, '');

        if (operator in supportedOperators) {
            queryObject.rating = {
                [supportedOperators[operator]]: Number(value)
            }
        }
    }

    if (Object.keys(queryObject).length > 0) {
        pipeline.push({
            $match: queryObject
        });
    }

    if (sort) {
        const sortVal = Buffer.from(sort, 'base64').toString();
        const parsedValue = JSON.parse(sortVal);
        const field = parsedValue["field"];
        const sortOrder = parsedValue["order"];
        const d = {
            $sort: {
                [field]: sortOrder
            }
        }
        pipeline.push(d);
    }

    if (fieldsRequired) {
        const fields = Buffer.from(fieldsRequired, "base64").toString();
        const parsedValue = JSON.parse(fields);
        let fieldsObj = {}
        parsedValue["fields"].forEach((obj) => {
            fieldsObj[obj] = 1
        })
        fieldsObj = {
            $project: fieldsObj
        };
        pipeline.push(fieldsObj)
    }

    const pagination = {
        '$facet': {
            metadata: [
                {$count: "total"},
                {$addFields: {page: Number(page)}}
            ],
            data: [
                {$skip: (page - 1) * Number(limitBy)},
                {$limit: Number(limitBy)}
            ]
        }
    }
    pipeline.push(pagination)
    let finalProducts;

    const products = await Product.aggregate(pipeline);
    finalProducts = products
    if ("metadata" in products[0] && "data" in products[0]) {
        finalProducts = products[0]["data"]
    }

    res.status(200).json({products: finalProducts, nbHits: finalProducts.length});
}

module.exports = {
    getAllProductsStatic, getAllProducts
}
