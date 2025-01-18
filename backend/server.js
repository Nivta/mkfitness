require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const app = express();

// חיבור למסד הנתונים
connectToDB();

// Middleware
app.use(express.json());
app.use(cors());

// הגשה של קבצים סטטיים
app.use(express.static(path.join(__dirname, '../front2/dist')));

// נתיבים
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front2/dist', 'index.html')); // תקן את הנתיב הזה אם יש שינוי במיקום
  });

// התחברות לשרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


