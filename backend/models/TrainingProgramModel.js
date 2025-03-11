const mongoose = require('mongoose');

// מגדירים את הסכימה של Exercise
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  repetitions: { type: Number, required: true },
  weight: { type: Number, required: false },
  tips: { type: String, required: true }
});

// מגדירים את הסכימה של תוכנית האימון
const trainingProgramSchema = new mongoose.Schema({
  exercises: [exerciseSchema],  // מערך של תרגילים
  totalCalories: { type: Number, required: true },
  foods: { type: [String], required: true },
  difficultyLevel: { type: Number, required: true }
});

// מייצרים את המודל
const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);

// יצוא המודל
module.exports = TrainingProgram;

