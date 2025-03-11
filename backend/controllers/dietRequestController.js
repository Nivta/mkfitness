const DietRequest = require('../models/DietRequesModel');
const TrainingProgram = require('../models/TrainingProgramModel');
const User = require('../models/userModel'); // המודל של המשתמש
exports.requestDietChange = async (req, res) => {
    try {
        const { idNumber } = req.body;

        if (!idNumber) {
            return res.status(400).json({ error: "חסר idNumber בבקשה" });
        }

        // חיפוש המשתמש במסד הנתונים
        const user = await User.findOne({ idNumber });

        if (!user) {
            return res.status(404).json({ error: "משתמש לא נמצא" });
        }

        // Debugging: הדפסת פרטי המשתמש כדי לוודא שהנתונים קיימים
        console.log("User found:", user);

        // קבלת התוכנית הנוכחית
        const currentDietPlan = user.selectedTrainingPlan;

        // Debugging: הדפסת התוכנית הנוכחית
        console.log("Current Diet Plan:", currentDietPlan);

        if (!currentDietPlan) {
            return res.status(400).json({ error: "למשתמש אין תוכנית תזונה נוכחית" });
        }

        // יצירת בקשה לשינוי תזונה
        const request = await DietRequest.create({
            idNumber,
            currentDietPlan,
            status: "pending",
        });

        res.status(201).json({ message: "בקשה נשלחה לאישור מנהל", request });
    } catch (error) {
        console.error("שגיאה בשליחת הבקשה:", error);
        res.status(500).json({ error: "שגיאה בשליחת הבקשה" });
    }
};
exports.approveDietChange = async (req, res) => {
    try {
        console.log("➡️ התחלת approveDietChange");

        const { idNumber } = req.body;

        if (!idNumber) {
            console.error("❌ חסר idNumber בבקשה");
            return res.status(400).json({ error: "חסר idNumber בבקשה" });
        }

        console.log("🔎 מחפש משתמש עם idNumber:", idNumber);
        const user = await User.findOne({ idNumber });

        if (!user) {
            console.error("❌ משתמש לא נמצא:", idNumber);
            return res.status(404).json({ error: "משתמש לא נמצא" });
        }

        console.log("✅ משתמש נמצא:", user);

        if (!user.selectedTrainingPlan || !user.selectedTrainingPlan.totalCalories) {
            console.error("❌ למשתמש אין תוכנית תזונה תקינה");
            return res.status(400).json({ error: "למשתמש אין תוכנית תזונה תקינה" });
        }

        // קבלת כמות הקלוריות מהתוכנית הנוכחית ישירות מתוך ה-user
        const currentCalories = user.selectedTrainingPlan.totalCalories;
        console.log("📊 כמות הקלוריות בתוכנית הנוכחית:", currentCalories);

        // חיפוש תוכנית עם פחות קלוריות
        console.log("🔍 מחפש תוכנית עם פחות קלוריות...");
        const lowerCaloriePlan = await TrainingProgram.findOne({
            totalCalories: { $lt: currentCalories }
        }).sort({ totalCalories: -1 });

        if (!lowerCaloriePlan) {
            console.error("❌ לא נמצאה תוכנית עם פחות קלוריות");
            return res.status(404).json({ error: "לא נמצאה תוכנית עם פחות קלוריות" });
        }

        console.log("✅ נמצאה תוכנית עם פחות קלוריות:", lowerCaloriePlan);

        // עדכון התוכנית של המשתמש
        user.selectedTrainingPlan = lowerCaloriePlan; // שומר את כל אובייקט התוכנית החדשה
        await user.save();
        console.log("✅ התוכנית החדשה נשמרה למשתמש");

        // מחיקת הבקשה
        console.log("🗑️ מוחק את הבקשה...");
        const deletedRequest = await DietRequest.findOneAndDelete({ idNumber });

        if (!deletedRequest) {
            console.error("⚠️ לא נמצאה בקשה לשינוי תוכנית למחיקה");
        } else {
            console.log("✅ הבקשה נמחקה בהצלחה");
        }

        res.status(200).json({
            message: "התוכנית עודכנה בהצלחה",
            newPlan: lowerCaloriePlan
        });

        console.log("🎉 סיום approveDietChange בהצלחה!");

    } catch (error) {
        console.error("❌ שגיאה בעדכון הבקשה:", error);
        res.status(500).json({ error: "שגיאה בעדכון הבקשה" });
    }
};

exports.rejectDietChange = async (req, res) => {
    try {
        const { idNumber } = req.body;

        if (!idNumber) {
            return res.status(400).json({ error: "חסר idNumber בבקשה" });
        }

        // חיפוש המשתמש
        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ error: "משתמש לא נמצא" });
        }

        // מחיקת הבקשה אם קיימת
        const deletedRequest = await DietRequest.findOneAndDelete({ idNumber });

        if (!deletedRequest) {
            return res.status(404).json({ error: "לא נמצאה בקשה לשינוי תוכנית" });
        }

        res.status(200).json({ message: "בקשת שינוי התוכנית נדחתה בהצלחה" });

    } catch (error) {
        console.error("שגיאה בדחיית הבקשה:", error);
        res.status(500).json({ error: "שגיאה בדחיית הבקשה" });
    }
};


exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await DietRequest.find({ status: 'pending' });
        console.log("Fetched pending requests:", pendingRequests);
        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ msg: 'Error fetching pending requests', error: error.message });
    }
};



