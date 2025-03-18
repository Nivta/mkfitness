const express = require("express");
const measurementController = require("../controllers/measurementController");

const router = express.Router();

router.post("/getMeasurements", measurementController.getMeasurements);
router.post("/addMeasurment", measurementController.addMeasurement);

module.exports = router;