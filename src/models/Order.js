// Order model with pre-validate and post-save hooks
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Order schema
 * - student: ref Student (required)
 * - snack: ref Snack (required)
 * - quantity: required 1..5 (validated in pre-validate hook)
 * - payableAmount: computed in pre-validate from snack.price * quantity
 * - createdAt: default Date.now
 */
const orderSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: [true, 'Student reference required'] },
  snack: { type: Schema.Types.ObjectId, ref: 'Snack', required: [true, 'Snack reference required'] },
  quantity: { type: Number, required: [true, 'Quantity required'] },
  payableAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// pre-validate hook: ensure quantity between 1 and 5 and compute payableAmount
orderSchema.pre('validate', async function preValidate(next) {
  try {
    if (!Number.isInteger(this.quantity)) {
      return next(new mongoose.Error.ValidationError({ message: 'Quantity must be an integer' }));
    }
    if (this.quantity < 1 || this.quantity > 5) {
      const err = new mongoose.Error.ValidationError(null);
      err.addError('quantity', new mongoose.Error.ValidatorError({
        message: 'Quantity must be between 1 and 5',
        path: 'quantity',
        value: this.quantity
      }));
      return next(err);
    }

    // populate snack price to compute payableAmount
    const Snack = mongoose.model('Snack');
    // eslint-disable-next-line no-await-in-loop
    const snackDoc = await Snack.findById(this.snack).lean();
    if (!snackDoc) {
      const err = new mongoose.Error.ValidationError(null);
      err.addError('snack', new mongoose.Error.ValidatorError({
        message: 'Referenced snack not found',
        path: 'snack',
        value: this.snack
      }));
      return next(err);
    }
    this.payableAmount = snackDoc.price * this.quantity;
    return next();
  } catch (err) {
    return next(err);
  }
});

// post-save hook: update snack.ordersCount and student.orders/totalSpent
orderSchema.post('save', async function postSave(doc, next) {
  try {
    const Snack = mongoose.model('Snack');
    const Student = mongoose.model('Student');

    // Increment snack.ordersCount by 1
    await Snack.findByIdAndUpdate(doc.snack, { $inc: { ordersCount: 1 } });

    // Push order ID to student.orders and increase totalSpent
    await Student.findByIdAndUpdate(doc.student, {
      $push: { orders: doc._id },
      $inc: { totalSpent: doc.payableAmount }
    });

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Order', orderSchema);
