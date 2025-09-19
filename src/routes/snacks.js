// Snacks routes
const express = require('express');

const router = express.Router();
const snackController = require('../controllers/snackController');

/**
 * POST /seed
 * - Create default snacks (or pass custom list in body)
 */
router.post('/seed', snackController.seedSnacks);

/**
 * GET /
 * - List snacks
 */
router.get('/', snackController.listSnacks);

module.exports = router;
