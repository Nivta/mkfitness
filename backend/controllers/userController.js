const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const user = req.body;
    console.log("Received registration request:", user); // הדפסת הנתונים שהתקבלו מהלקוח

    // בדוק אם כל השדות החשובים קיימים
    if (!user.fullName || !user.email || !user.idNumber || !user.password || !user.phone || !user.age || !user.height || !user.weight || !user.gender || !user.diet || !user.dailyCalories || !user.dangerousFoods || !user.favoriteFoods || !user.dislikeFoods) {
        console.log("Missing fields in request body:", user);
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // בדוק אם המשתמש כבר קיים
        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({ $or: [{ email: user.email }, { idNumber: user.idNumber }] });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // הצפנת הסיסמה
        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        console.log("Password hashed successfully.");

        // מציאת השאלות שנענו "כן"
        console.log("Processing health questions...");
        const healthQuestions = user.healthQuestions || [];
        console.log("Health questions received:", healthQuestions);
        
        const positiveAnswers = healthQuestions
            .filter(q => q.answer.toLowerCase() === 'כן')
            .map(q => q.question);
        console.log("User answered 'Yes' to:", positiveAnswers);

        // המרת השדות dangerousFoods, favoriteFoods, dislikeFoods למערכים אם הם לא כבר מערכים
        console.log("Parsing food preferences...");
        user.dangerousFoods = typeof user.dangerousFoods === 'string' ? user.dangerousFoods.split(/[\s,]+/) : user.dangerousFoods;
        user.favoriteFoods = typeof user.favoriteFoods === 'string' ? user.favoriteFoods.split(/[\s,]+/) : user.favoriteFoods;
        user.dislikeFoods = typeof user.dislikeFoods === 'string' ? user.dislikeFoods.split(/[\s,]+/) : user.dislikeFoods;

        // יצירת המשתמש
        console.log("Creating new user in database...");
        const newUser = await User.create({ ...user, password: hashedPassword });
        console.log("User created successfully:", newUser);

        // הגדרת טרנספורטר לשליחת המייל
        console.log("Setting up email transporter...");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // הגדרת אפשרויות המייל
        console.log("Preparing email to send...");
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL_MANAGER,
            subject: 'New User Registered',
            text: `A new user has registered:\n\n
            Full Name: ${newUser.fullName}\n
            Email: ${newUser.email}\n
            ID Number: ${newUser.idNumber}\n
            Phone: ${newUser.phone}\n
            Age: ${newUser.age}\n
            Height: ${newUser.height}\n
            Weight: ${newUser.weight}\n
            Gender: ${newUser.gender}\n
            Daily Calories: ${newUser.dailyCalories}\n
            Diet: ${newUser.diet}\n
            Activity Level: ${newUser.activityLevel || 'Not provided'}\n
            Allergy Foods: ${newUser.dangerousFoods.length > 0 ? newUser.dangerousFoods.join(', ') : 'Not provided'}\n
            Favorite Foods: ${newUser.favoriteFoods.length > 0 ? newUser.favoriteFoods.join(', ') : 'Not provided'}\n
            Dislike Foods: ${newUser.dislikeFoods.length > 0 ? newUser.dislikeFoods.join(', ') : 'Not provided'}\n
            Eats Eggs: ${newUser.eatsEggs ? 'Yes' : 'No'}\n
            Eats Dairy: ${newUser.eatsDairy ? 'Yes' : 'No'}\n
            Eats Fish: ${newUser.eatsFish ? 'Yes' : 'No'}\n
            Goal: ${newUser.goal || 'Not provided'}\n
            Training Location: ${newUser.trainingLocation || 'Not provided'}\n
            Status: ${newUser.status}\n
            Health Declaration: ${positiveAnswers.length > 0 ? "User answered 'Yes' to the following questions:\n" + positiveAnswers.join("\n") : "No health issues reported."}\n\n
            Health Questions Answered:\n
            ${healthQuestions.map(q => `${q.question}: ${q.answer}`).join("\n")}`
        };

        // שלח את המייל
        console.log("Sending email...");
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");

        // שלח תשובה עם המידע על המשתמש
        res.status(201).json({ msg: 'Registration pending approval', user: newUser });
    } catch (error) {
        console.log("Error during registration:", error);
        res.status(500).json({ msg: 'Error registering user', error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { idNumber, password, email, ...updateFields } = req.body; // הוצאת email מהעדכון אם הוא קיים

        // בדיקה אם המשתמש קיים
        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // אם יש שדה password, עדכון הסיסמה
        if (password) {
            user.password = password;
        }

        // אם יש שדה email, בודקים אם המייל לא השתנה
        if (email && email !== user.email) {
            user.email = email;
        }

        // עדכון שאר הנתונים ושמירתם
        Object.assign(user, updateFields);
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { registerUser, updateUser };




