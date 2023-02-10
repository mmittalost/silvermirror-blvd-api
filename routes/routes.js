//var express = require('express');
 router = express.Router();
 var path = require('path');

var AdminCtrl = require('../controllers/admin');

// Admin
router.get('/get_services', AdminCtrl.getServices);
router.get('/get_locations', AdminCtrl.getLocations);

router.post('/get_staff_by_location', AdminCtrl.getStaffByLocation);
router.post('/createClient', AdminCtrl.createClient);
router.post('/get_client_by_email', AdminCtrl.getClientByEmail);

// TEST
router.get('/', function(req,res){
    res.json({msg:'Hi, your app is up and running. Visit ost Agency for doubts! -- Div'});
});

module.exports = router ;
