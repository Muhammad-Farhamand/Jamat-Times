const express = require('express');
const mosqueController = require('../controllers/mosquecontroller');

const router = express.Router();

router.route('/').get(mosqueController.getAllMosque)

router.route('/:id').get(mosqueController.getMosque)

module.exports = router;