const express = require('express');
const caretaker = require('../controllers/caretakerController');

const router = express.Router();

router.route('/signup').post(caretaker.caretakerSignup,caretaker.createMosque);
// router.route('/login').post(caretaker.caretakerLogin);

router.route('/update/:id').patch(caretaker.updateMosqueTimings);

module.exports = router;