const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  idNumber: { type: String, required: true },
  date: { type: String, required: true },
  weight: { type: Number, required: true },
  chest: { type: Number, required: true },
  waist: { type: Number, required: true },
  hips: { type: Number, required: true },
  arm: { type: Number, required: true },
});

module.exports = mongoose.model("Measurement", MeasurementSchema);