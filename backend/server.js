require('dotenv').config(); // טוען את משתני הסביבה מתוך קובץ .env
const mongoose = require('mongoose'); // חיבור לספריית Mongoose לניהול חיבור עם MongoDB
const express = require('express'); // חיבור לספריית Express לניהול השרת
const path = require('path');
const nodemailer = require('nodemailer'); // חיבור לספריית Nodemailer לשליחת מיילים
const cors = require('cors'); // חיבור לספריית CORS (Cross-Origin Resource Sharing)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express(); // יצירת מופע של Express (השרת)

// שימוש בקבצים סטטיים ופרמטרים שונים
app.use(express.static("../front2/dist"));
app.use(express.json()); // מאפשר לשרת לקבל נתונים בפורמט JSON בבקשות POST
app.use(cors()); // שימוש ב-CORS עבור כל הבקשות

let userModel; // הגדרת משתנה שיכיל את המודל של משתמשים
let adminModel;

// התחברות למסד נתונים MongoDB
async function connectToDB() {
    try {
        // חיבור למסד הנתונים באמצעות משתנה סביבתי
        await mongoose.connect(process.env.MONGODB_URI); // חיבור באמצעות משתנה סביבה
        console.log('connected to DB'); // הודעה על חיבור מוצלח למסד הנתונים
        
        // הגדרת סכמת המשתמשים
        const userSchema = mongoose.Schema({
            fullName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            idNumber: { type: String, required: true },
            password: { type: String, required: true },
            phone: { type: String, required: true },
            age: { type: Number, required: true },
            height: { type: Number, required: true },
            gender: { type: String, required: true },
            weight: { type: Number, required: true },
            dailyCalories: { type: Number, required: true},
            activityLevel: { type: String, required: false },
            dangerousFoods: { type: String, required: false },
            favoriteFoods: { type: String, required: false },
            dislikeFoods: { type: String, required: false },
            diet: { type: String, required: true },
            eatsEggs: { type: Boolean, required: false, default: false },
            eatsDairy: { type: Boolean, required: false, default: false },
            eatsFish: { type: Boolean, required: false, default: false },
            goal: { type: String, required: false },
            trainingLocation: { type: String, required: false },
            status: { type: String, enum: ["pending", "active"], default: "pending" }
        });
        const adminSchema = mongoose.Schema({
            fullName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true }
        });

        // יצירת המודל של המשתמשים לפי הסכימה
        userModel = mongoose.model('user', userSchema);
        adminModel = mongoose.model('admin', adminSchema);
    } catch (error) {
        console.log('ERROR: ' + error); // טיפול בשגיאות במהלך החיבור
    }
}

connectToDB(); // קריאה לפונקציה כדי להתחבר למסד הנתונים

// פונקציה לאימות משתמש אדמין
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Received Token:', token); // הדפסת הטוקן שהתקבל

        if (!token) {
            console.log('No token received'); // הדפסת אם לא התקבל טוקן
            throw new Error('Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // הדפסת המידע המפוענח מהטוקן

        // ישירות להשתמש במזהה כ- string (כפי שהוא בטוקן)
        const admin = await adminModel.findById(decoded.id);
        console.log('Found admin by ID:', admin); // הדפסת פרטי המנהל שנמצא לפי ה-ID

        if (!admin) {
            console.log('Admin not found'); // הדפסת אם לא נמצא המנהל
            throw new Error('Authentication failed');
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log('Error in Admin Authentication:', error); // הדפסת שגיאות במהלך האימות
        res.status(401).json({ message: 'Please authenticate' });
    }
};


app.post('/register', async (req, res) => {
    const user = req.body;
    console.log(user)
    // בדיקה אם כל הנתונים הגיעו
  

    if (!fullName || !email || !idNumber || !password || !phone || !age || !height || !weight || !gender || !diet||! dailyCalories) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // בדיקה אם כבר יש משתמש עם אותו אימייל או מספר תעודת זהות
        const existingUser = await userModel.findOne({ $or: [{ email }, { idNumber }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email or ID number already exists' });
        }

        // הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);  // יצירת מלח (Salt) חדש
        const hashedPassword = await bcrypt.hash(password, salt);  // הצפנת הסיסמה

        // יצירת אובייקט של משתמש חדש
    
    const newUser = await userModel.create( user ) // ברגע הראשון המשתמש יהיה במצב "ממתין"


        // יצירת טרנספורטר לשליחת המייל
        const transporter = nodemailer.createTransport({
            service: 'gmail', // לדוגמה, ניתן להשתמש ב-Gmail
            auth: {
                user: process.env.EMAIL, // כתובת המייל שלך
                pass: process.env.EMAIL_PASS  // סיסמת המייל שלך או App Password
            }
        });

        // תוכן המייל
        const mailOptions = {
            from: process.env.EMAIL, // כתובת השולח
            to: process.env.EMAIL_MANAGER, // כתובת המייל של המנהל
            subject: 'New User Registered',
            text: `A new user has registered: \n\n
            Full Name: ${newUser.fullName}\n
            Email: ${newUser.email}\n
            ID Number: ${newUser.idNumber}\n
            Phone: ${newUser.phone}\n
            Age: ${newUser.age}\n
            Height: ${newUser.height}\n
            Weight: ${newUser.weight}\n
            Gender: ${newUser.gender}\n
            Diet: ${newUser.diet}\n\n
            Please review the new registration.`
        };

        // שליחת המייל
        await transporter.sendMail(mailOptions);
        console.log('Email sent to admin successfully!');

        // החזרת תשובה חיובית על הצלחה
        res.status(201).json({ msg: 'חכה לאישור המנהל ', user: newUser });

    } catch (error) {
        console.error('Error creating user or sending email:', error);
        res.status(500).json({ msg: 'Cannot add user', error: error.message });
    }
});
// יצירת המנהל החדש
app.post('/admin/register', async (req, res) => {
    const { email, password, fullName } = req.body;
    console.log({ email, password, fullName })
    // בדיקה אם כל הנתונים הגיעו
    if (!email || !password || !fullName) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);  // יצירת מלח (Salt) חדש
        const hashedPassword = await bcrypt.hash(password, salt);  // הצפנת הסיסמה

        // יצירת אובייקט של אדמין חדש
        const newAdmin = await adminModel.create({
            email,
            password: hashedPassword,
            fullName
        });

        // החזרת תשובה חיובית על הצלחה
        res.status(201).json({ msg: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        // טיפול בשגיאות
        console.error('Error creating admin:', error);
        res.status(500).json({ msg: 'Cannot add admin', error: error.message });
    }
});

// התחברות באמצעות admin
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received password from client:', password); // הדפסת הסיסמה שהוזנה מהלקוח

        // בדיקה אם זה אדמין
        const admin = await adminModel.findOne({ email });
        
        if (admin) {
            // בדוק אם הסיסמה נכונה
            const isValidPassword = await bcrypt.compare(password, admin.password);

            if (isValidPassword) {
                // יצירת טוקן אם הסיסמה נכונה
                const token = jwt.sign(
                    { id: admin._id },  // וודא שאתה משתמש ב-_id
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                return res.json({ 
                    userType: 'admin',
                    user: admin,
                    token: token
                });
            } else {
                return res.status(401).json({ message: 'סיסמה שגויה' });
            }
        }

        // אם לא נמצא אדמין, נבדוק אם זה משתמש רגיל
        const user = await userModel.findOne({ email, status: 'active' });
        console.log('Found user in DB:', user); // הדפסת פרטי המשתמש שמצאנו

        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
                return res.json({
                    userType: 'user',
                    user: user,
                });
            }
        }

        console.log('No matching user found'); // הודעה אם לא נמצא משתמש
        res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'שגיאת שרת' });
    }
});

// הצגת משתמשים ממתינים
app.get('/admin/pending', authenticateAdmin, async (req, res) => {
    try {
        const pendingUsers = await userModel.find({ status: 'pending' });
        console.log('Pending users:', pendingUsers); // הדפסת המשתמשים הממתינים
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching pending users', error: error.message });
    }
});

// אישור משתמש
app.post('/admin/approve/:idNumber', authenticateAdmin, async (req, res) => {
    const { idNumber } = req.params;

    try {
        const user = await userModel.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.status = 'active';
        await user.save();

        console.log('User approved:', user); // הדפסת פרטי המשתמש שאושר
        res.status(200).json({ msg: 'User approved successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error approving user', error: error.message });
    }
});

// דחיית משתמש
app.delete('/admin/deny/:idNumber', authenticateAdmin, async (req, res) => {
    const { idNumber } = req.params;

    try {
        // חיפוש המשתמש בבסיס הנתונים לפי idNumber
        const user = await userModel.findOne({ idNumber });

        // אם המשתמש לא נמצא, נחזיר שגיאה
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // מחיקת המשתמש
        await userModel.deleteOne({ idNumber });

        // הדפסת פרטי המשתמש שנמחק
        console.log('User denied and deleted:', user);

        // החזרת תגובה חיובית
        res.status(200).json({ msg: 'User denied and deleted successfully' });
    } catch (error) {
        // טיפול בשגיאות
        res.status(500).json({ msg: 'Error denying and deleting user', error: error.message });
    }
});

// שמיעת בקשות על הפורט שנמצא בקובץ .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});


