const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);
