//var express = require('express');
 router = express.Router();
 var path = require('path');

var AdminCtrl = require('../controllers/admin');
var ClientCtrl = require('../controllers/client');

// Admin
router.get('/get_services', AdminCtrl.getServices);
router.get('/get_locations', AdminCtrl.getLocations);

router.post('/get_staff_by_location', AdminCtrl.getStaffByLocation);
router.post('/createClient', AdminCtrl.createClient);
router.post('/get_client_by_email', AdminCtrl.getClientByEmail);


// Client
router.post('/get_cart_bookable_dates', ClientCtrl.getCartBookableDates);
router.post('/create_cart', ClientCtrl.createCart);
router.post('/get_cart_detail', ClientCtrl.getCartDetail);

router.get('/get_business', ClientCtrl.getBusiness);


// Test
router.get('/', function(req,res){
    res.json({msg:'Hi, your app is up and running. Visit ost Agency for doubts! -- Div'});
});

module.exports = router ;
