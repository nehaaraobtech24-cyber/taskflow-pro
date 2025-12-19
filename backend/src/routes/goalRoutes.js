const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// GET all goals
router.get('/', goalController.getAllGoals);

// GET single goal by ID
router.get('/:id', goalController.getGoalById);

// POST create new goal
router.post('/', goalController.createGoal);

// PUT update goal
router.put('/:id', goalController.updateGoal);

// DELETE goal
router.delete('/:id', goalController.deleteGoal);

// POST increment goal progress
router.post('/:id/increment', goalController.incrementGoal);

module.exports = router;