const express = require('express');
const donationController = require('../controllers/donatecontroller');
const upload = require('../../utils/upload')

const router = express.Router();

router.route('/')
.get(donationController.getAllDonations)
.post(upload.array('images[]'), donationController.createDonation);

router.route('/:id').delete(donationController.deleteDonation);
router.route('/update/:id').put(upload.array('images[]'), donationController.updateDonation);


module.exports = router;