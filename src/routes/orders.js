// Orders routes
const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

/**
 * POST /orders
 * Create order: { studentId, snackId, quantity }
 */
router.post('/', orderController.createOrder);

module.exports = router;
