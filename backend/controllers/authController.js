const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin) {
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (isValidPassword) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ userType: 'admin', user: admin, token });
        }
        return res.status(401).json({ message: 'Incorrect password' });
    }

    const user = await User.findOne({ email, status: 'active' });
    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(isValidPassword)
        if (isValidPassword) {
            return res.json({ userType: 'user', user });
        }
    }

    res.status(401).json({ message: 'Invalid credentials' });
};

module.exports = { login };
