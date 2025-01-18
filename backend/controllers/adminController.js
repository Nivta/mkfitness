const User = require('../models/userModel');

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
        user.status = 'active';
        await user.save();
        res.status(200).json({ msg: 'User approved' });
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
    
            // הדפסת פרטי המשתמש שנמחק
            console.log('User denied and deleted:', user);
    
            // החזרת תגובה חיובית
            res.status(200).json({ msg: 'User denied and deleted successfully' });
        } catch (error) {
            // טיפול בשגיאות
            res.status(500).json({ msg: 'Error denying and deleting user', error: error.message });
        }
};

module.exports = { getPendingUsers, approveUser, denyUser };
