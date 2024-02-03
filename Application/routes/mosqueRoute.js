const express = require('express');
const mosqueController = require('../controllers/mosquecontroller');

const router = express.Router();

router.route('/')
.get(mosqueController.getAllMosque)
.post(mosqueController.createMosque);

router.route('/:id')
.get(mosqueController.getMosque)
.patch(mosqueController.updateMosqueTimings)
.delete(mosqueController.deleteMosque);

// router.route("/timings/:id").get(mosqueController.getTimings);

module.exports = router;