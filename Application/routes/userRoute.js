const express = require('express');
const userController = require('./../controllers/usercontroller');

const router = express.Router();


router.route('/login').post(userController.login);
router.route('/signup').post(userController.signup);
router.route('/:username/donations/push').patch(userController.pushDonation);
router.route('/:username/donations/view').get(userController.viewDonations);


module.exports = router;