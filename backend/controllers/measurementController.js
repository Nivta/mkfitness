const Measurement = require("../models/MeasurementModel");

// פונקציה לקבלת המדידות של משתמש לפי userId
exports.getMeasurements = async (req, res) => {
    try {
      const { idNumber } = req.body; // שינוי: קבלת userId מגוף הבקשה
      if (!idNumber) return res.status(400).json({ message: "User ID is required" });

      const measurements = await Measurement.find({ idNumber });
      res.status(200).json(measurements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.addMeasurement = async (req, res) => {
  try {
    // בדיקה אם כל השדות הגיעו ב-body
    const { idNumber, date, weight, chest, waist, hips, arm } = req.body;

    console.log("Received data:", req.body); // הדפסת הנתונים המתקבלים

    // אם אין idNumber, מחזיר שגיאה עם סטטוס 400
    if (!idNumber) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // יצירת מדידה חדשה במסד הנתונים
    const newMeasurement = await Measurement.create({ idNumber, date, weight, chest, waist, hips, arm });

    console.log("New measurement created:", newMeasurement); // הדפסת המדידה שנוצרה

    // מחזיר את המדידה החדשה שנשמרה עם סטטוס 201
    res.status(201).json(newMeasurement);

  } catch (error) {
    // במקרה של שגיאה, החזר שגיאה עם סטטוס 500 ופרטי השגיאה
    console.error("Error occurred:", error); // הדפסת השגיאה
    res.status(500).json({ message: error.message });
  }
};
