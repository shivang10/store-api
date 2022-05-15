const Product = require("../models/product");
const supportedOperators = require("../utils/operators");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        name: "vase table",
    });
    res.status(200).json({msg: products, nbHits: products.length});
}

const getAllProducts = async (req, res) => {
    const {
        featured, company, name, sort, price, rating, page, limitBy = 10
    } = req.query;
    let pipeline = []
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === "true";
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = name;
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

    if (page && page > 1) {
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
    }
    let finalProducts;

    if (pipeline.length === 0) {
        finalProducts = await Product.find();

    } else {
        const products = await Product.aggregate(pipeline);
        finalProducts = products

        if ("metadata" in products[0] && "data" in products[0]) {
            finalProducts = products[0]["data"]
        }
    }

    res.status(200).json({products: finalProducts, nbHits: finalProducts.length});
}

module.exports = {
    getAllProductsStatic, getAllProducts
}
