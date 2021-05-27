const express = require('express');
const router = express.Router();

const AuthRoutes = require('./../../services/auth');
const ProductRoutes = require('./../../services/products')
//New 

router.use('/auth', AuthRoutes)
router.use('/product', ProductRoutes)

// router.use('/leave', LeaveRoutes) //Apply Middleware token 
// router.use('/holiday', HolidayRoutes)



module.exports = router;
