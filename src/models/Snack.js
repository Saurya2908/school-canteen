// Snack model with title, price, ordersCount
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Snack schema
 * - title: required
 * - price: required (Number)
 * - ordersCount: default 0
 */
const snackSchema = new Schema({
  title: { type: String, required: [true, 'Snack title is required'] },
  price: { type: Number, required: [true, 'Snack price is required'], min: [0, 'Price must be >= 0'] },
  ordersCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Snack', snackSchema);
