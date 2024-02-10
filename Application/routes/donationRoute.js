const express = require('express');
const donationController = require('../controllers/donatecontroller');

const router = express.Router();

router.route('/')
.get(donationController.getAllDonations)
.post(donationController.createDonation);


module.exports = router;