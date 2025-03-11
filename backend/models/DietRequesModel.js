const mongoose = require("mongoose");

const DietRequestSchema = new mongoose.Schema({
    idNumber: { type: String, required: true },
    currentDietPlan: { type: Object, required: true }, // נשמור רק את התוכנית הישנה
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});
const DietRequest=mongoose.model("DietRequest", DietRequestSchema);
module.exports = DietRequest    