//var express = require('express');
 router = express.Router();
 var path = require('path');

var AdminCtrl = require('../controllers/admin');
var ClientCtrl = require('../controllers/client');
var FileUploadCtrl = require('../controllers/file-upload');

// Admin
router.get('/get_services', AdminCtrl.getServices);
router.get('/get_locations', AdminCtrl.getLocations);

router.post('/get_staff_by_location', AdminCtrl.getStaffByLocation);
router.post('/createClient', AdminCtrl.createClient);
router.post('/get_client_by_email', AdminCtrl.getClientByEmail);
router.post('/rechedule_appointment', AdminCtrl.rescheduleAppointment);
router.post('/appointment_reschedule_available_dates', AdminCtrl.appointmentRescheduleAvailableDates);
router.post('/appointment_reschedule_available_times', AdminCtrl.appointmentRescheduleAvailableTimes);
// router.post('/update_client', AdminCtrl.updateClient);

// Client
router.post('/login', ClientCtrl.login);
router.post('/get_cart_bookable_dates', ClientCtrl.getCartBookableDates);
router.post('/get_cart_bookable_times', ClientCtrl.getCartBookableTimes);
router.post('/create_cart', ClientCtrl.createCart);
router.post('/get_cart_detail', ClientCtrl.getCartDetail);
router.post('/add_item_in_cart', ClientCtrl.addIteminCart);
router.post('/remove_item_in_cart', ClientCtrl.removeIteminCart);
router.post('/get_service_staff_varients', ClientCtrl.getServiceStaffVarients);
router.post('/reserve_cart_bookable_items', ClientCtrl.reserveCartBookableItems);
router.post('/update_cart_client_info',ClientCtrl.updateCartClientInfo);
router.post('/add_cart_card_payment_method',ClientCtrl.addCartCardPaymentMethod);
router.post('/checkout_cart', ClientCtrl.checkoutCart);
router.post('/add_cart_offer', ClientCtrl.addCartOffer);
router.post('/remove_cart_offer', ClientCtrl.removeCartOffer);
router.post('/get_service_staff_varients', ClientCtrl.getServiceStaffVarients);
router.post('/create_cart_guest', ClientCtrl.createCartGuest);
router.post('/remove_cart_guest', ClientCtrl.removeCartGuest);
router.post('/add_service_options_in_cart', ClientCtrl.addServiceOptionsInCart);
router.post('/get_client_by_id', ClientCtrl.getClientById);
router.post('/get_business', ClientCtrl.getBusiness);
router.post('/take_cart_ownership', ClientCtrl.takeCartOwnership);
router.post('/update_client', ClientCtrl.updateClient);
router.post('/my_appointments', ClientCtrl.myAppointments);
router.post('/appointment_detail', ClientCtrl.appointmentDetail);
router.post('/cancel_appointment', ClientCtrl.cancelAppointment);
router.post('/cart_clear', ClientCtrl.cartClear);
router.post('/my_memberships', ClientCtrl.myMemberships);
router.post('/add_product_in_cart', ClientCtrl.addProductinCart);
router.post('/select_cart_payment_method', ClientCtrl.selectCartPaymentMethod);
router.post('/get_cart_staff_variants', ClientCtrl.getCartStaffVariants);
router.post('/update_item_in_cart', ClientCtrl.updateIteminCart);


// FILE UPLOAD
router.post('/upload_file', FileUploadCtrl.uploadFile);


// Test
router.get('/', function(req,res){
    res.json({msg:'Hi, your app is up and running. Visit ost Agency for doubts! -- Div'});
});

module.exports = router ;
