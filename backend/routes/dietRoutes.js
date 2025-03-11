const express = require("express");
const router = express.Router();
const dietController = require("../controllers/dietRequestController");


// שליחת בקשה לשינוי תוכנית תזונה
router.post("/request-change",  dietController.requestDietChange);

// מנהל: אישור שינוי תזונה
router.post("/approve-change", dietController.approveDietChange);
//תחיית תוכנית 
router.post("/reject-change", dietController.rejectDietChange );

// מנהל: שליפת כל הבקשות הממתינות לאישור
router.get("/pending-requests", dietController.getPendingRequests);

module.exports = router;
