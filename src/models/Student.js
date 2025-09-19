// Student model with referralCode generation
const mongoose = require('mongoose');
const generateReferralCode = require('../utils/generateReferralCode');

const { Schema } = mongoose;

/**
 * Student schema
 * - name: required
 * - referralCode: unique, auto-generated in pre-save if missing
 * - totalSpent: number, default 0
 * - orders: array of ObjectIds referencing Order
 */
const studentSchema = new Schema({
  name: { type: String, required: [true, 'Student name is required'] },
  referralCode: { type: String, unique: true, sparse: true },
  totalSpent: { type: Number, default: 0 },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

// pre-save hook: generate referralCode for new students if missing
studentSchema.pre('save', async function preSave(next) {
  try {
    if (this.isNew && !this.referralCode) {
      // ensure uniqueness (try a few times; if collision after many attempts let DB unique index handle error)
      for (let i = 0; i < 5; i += 1) {
        const code = generateReferralCode();
        // quick check — avoid unnecessary DB trips in heavy load but ensures less collisions
        // eslint-disable-next-line no-await-in-loop
        const existing = await mongoose.models.Student.findOne({ referralCode: code }).lean();
        if (!existing) {
          this.referralCode = code;
          break;
        }
      }
      if (!this.referralCode) {
        // fallback: assign generated code (unique index may still reject duplicate)
        this.referralCode = generateReferralCode();
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Student', studentSchema);
