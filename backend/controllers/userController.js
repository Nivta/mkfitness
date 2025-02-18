const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const user = req.body;

    // בדוק אם כל השדות החשובים קיימים
    if (!user.fullName || !user.email || !user.idNumber || !user.password || !user.phone || !user.age || !user.height || !user.weight || !user.gender || !user.diet || !user.dailyCalories) {
        console.log("Missing fields in request body:", user);
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        console.log("Checking if user exists...");
        // בדוק אם המשתמש כבר קיים
        const existingUser = await User.findOne({ $or: [{ email: user.email }, { idNumber: user.idNumber }] });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // הצפנת הסיסמה
        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // מציאת השאלות שנענו "כן"
        console.log("Processing health questions...");
        const healthQuestions = user.healthQuestions || [];
        const positiveAnswers = healthQuestions
            .filter(q => q.answer.toLowerCase() === 'כן') // נבדוק תשובות של "כן"
            .map(q => q.question); // נשמור רק את השאלות

        console.log("Creating new user...");
        // יצירת המשתמש
        const newUser = await User.create({ ...user, password: hashedPassword });

        // הגדרת טרנספורטר לשליחת המייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Preparing email...");
        // הגדרת אפשרויות המייל
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
            Allergy Foods: ${newUser.dangerousFoods || 'Not provided'}\n
            Favorite Foods: ${newUser.favoriteFoods || 'Not provided'}\n
            Dislike Foods: ${newUser.dislikeFoods || 'Not provided'}\n
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

        console.log("Sending email...");
        // שלח את המייל
        await transporter.sendMail(mailOptions);

        // שלח תשובה עם המידע על המשתמש
        console.log("Registration successful. Responding to client...");
        res.status(201).json({ msg: 'Registration pending approval', user: newUser });
    } catch (error) {
        console.log("Error during registration:", error);
        res.status(500).json({ msg: 'Error registering user', error: error.message });
    }
};

module.exports = { registerUser };

