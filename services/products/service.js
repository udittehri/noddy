const Product = require('./products');

class ProductService {

    getProduct(request) {
        return Product.findOne(request);
    }
    getAllProducts(request) {
        return Product.find(request);
    }

    createProduct(details) {
        return new Product(details).save();
    }

    updateProduct(criteria, details) {
        return Product.findOneAndUpdate(criteria, details, { new: true })
    }

    // Delete User is To Update User with status Disabled 
}

module.exports = new ProductService();