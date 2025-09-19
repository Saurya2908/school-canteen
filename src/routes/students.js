// Students routes
const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

/**
 * POST /students
 * Create a new student
 */
router.post('/', studentController.createStudent);

/**
 * GET /students/:id
 * Get student with optional ?populateOrders=true
 */
router.get('/:id', studentController.getStudent);

module.exports = router;
