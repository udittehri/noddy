const express = require('express');
const router = express.Router();

const ProductController = require('./controller');

router.get('/get', ProductController.getMyProduct)
router.post('/create', ProductController.createProduct)
router.post('/update', ProductController.updateProduct)


module.exports = router;
