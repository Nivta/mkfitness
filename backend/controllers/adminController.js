const User = require('../models/userModel');
const nodemailer = require('nodemailer');
// פונקציה להצגת כל המשתמשים הממתינים
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        console.log(pendingUsers)
        res.status(200).json(pendingUsers);

    } catch (error) {
        res.status(500).json({ msg: 'Error fetching pending users', error: error.message });
    }
};

// פונקציה לאישור משתמש
const approveUser = async (req, res) => {
    const { idNumber } = req.params;
    try {
        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // עדכון הסטטוס ל-"active"
        user.status = 'active';
        await user.save();

        // יצירת תחבורה לשליחת המייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // הגדרת אפשרויות המייל
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email, // שולחים למייל של המשתמש
            subject: 'Your Account has been Approved',
            text: `Hello ${user.fullName},\n\nYour account has been approved and is now active.\nYou can now access all the features of the system.\n\nBest regards,\nThe Team`
        };

        // שליחת המייל
        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'User approved and email sent' });
    } catch (error) {
        res.status(500).json({ msg: 'Error approving user', error: error.message });
    }
};
// פונקציה לדחיית משתמש
const denyUser = async (req, res) => {
    const { idNumber } = req.params;

    try {
        // חיפוש המשתמש בבסיס הנתונים לפי idNumber
        const user = await User.findOne({ idNumber });

        // אם המשתמש לא נמצא, נחזיר שגיאה
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // מחיקת המשתמש
        await User.deleteOne({ idNumber });

        // יצירת תחבורה לשליחת המייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // הגדרת אפשרויות המייל
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email, // שולחים למייל של המשתמש
            subject: 'Your Registration has been Denied',
            text: `Hello ${user.fullName},\n\nWe regret to inform you that your registration has been denied. Your account will not be activated.\nIf you believe this is an error, please contact support.\n\nBest regards,\nThe Team`
        };

        // שליחת המייל
        await transporter.sendMail(mailOptions);

        // הדפסת פרטי המשתמש שנמחק
        console.log('User denied and deleted:', user);

        // החזרת תגובה חיובית
        res.status(200).json({ msg: 'User denied and deleted successfully, email sent' });
    } catch (error) {
        // טיפול בשגיאות
        res.status(500).json({ msg: 'Error denying and deleting user', error: error.message });
    }
};

module.exports = { getPendingUsers, approveUser, denyUser };
