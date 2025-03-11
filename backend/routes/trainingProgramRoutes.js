// routes/trainingProgramRoutes.js
const express = require('express');
const router = express.Router();
const TrainingProgramController = require('../controllers/TrainingProgramController');

// נתיב ליצירת תוכנית אימון
router.post('/', TrainingProgramController.createTrainingProgram);

//  נתיב שמירת תוכנית אימון של משתמש 
router.post('/createTrainingPlanByUser', TrainingProgramController.createTrainingPlanByUser);

router.post('/update-training-plan', TrainingProgramController.updateTrainingPlan);

// נתיב למחיקת תוכנית אימון
router.delete('/:id', TrainingProgramController.deleteTrainingProgram);

module.exports = router;

