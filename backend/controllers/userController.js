const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const registerUser = async (req, res) => {
    const user = req.body;

    if (!user.fullName || !user.email || !user.idNumber || !user.password || !user.phone || !user.age || !user.height || !user.weight || !user.gender || !user.diet || !user.dailyCalories) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email: user.email }, { idNumber: user.idNumber }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = await User.create({ ...user, password: hashedPassword });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

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
            allergy Foods: ${newUser.dangerousFoods || 'Not provided'}\n
            Favorite Foods: ${newUser.favoriteFoods || 'Not provided'}\n
            Dislike Foods: ${newUser.dislikeFoods || 'Not provided'}\n
            Eats Eggs: ${newUser.eatsEggs ? 'Yes' : 'No'}\n
            Eats Dairy: ${newUser.eatsDairy ? 'Yes' : 'No'}\n
            Eats Fish: ${newUser.eatsFish ? 'Yes' : 'No'}\n
            Goal: ${newUser.goal || 'Not provided'}\n
            Training Location: ${newUser.trainingLocation || 'Not provided'}\n
            Status: ${newUser.status}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ msg: 'Registration pending approval', user: newUser });
    } catch (error) {
        res.status(500).json({ msg: 'Error registering user', error: error.message });
    }
};

module.exports = { registerUser };
