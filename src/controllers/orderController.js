// Order controller
const Order = require('../models/Order');
const Student = require('../models/Student');
const Snack = require('../models/Snack');

/**
 * Create an order
 * body: { studentId, snackId, quantity }
 * - pre-validate hook runs to compute payableAmount and validate quantity and snack existence
 * - post-save hook updates Snack and Student
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { studentId, snackId, quantity } = req.body;

    // Basic checks before creating document (more checks happen inside hooks)
    if (!studentId || !snackId || quantity === undefined) {
      return res.status(400).json({ message: 'studentId, snackId and quantity are required' });
    }

    // Ensure student exists early (friendly error)
    const studentExists = await Student.exists({ _id: studentId });
    if (!studentExists) return res.status(404).json({ message: 'Student not found' });

    // Ensure snack exists early (pre-validate will also check)
    const snackExists = await Snack.exists({ _id: snackId });
    if (!snackExists) return res.status(404).json({ message: 'Snack not found' });

    const order = await Order.create({
      student: studentId,
      snack: snackId,
      quantity
      // payableAmount will be set in pre-validate
    });

    // return newly created order (populate lightweight fields)
    const populated = await Order.findById(order._id)
      .populate({ path: 'snack', select: 'title price' })
      .populate({ path: 'student', select: 'name referralCode' })
      .lean();

    return res.status(201).json({ order: populated });
  } catch (err) {
    return next(err);
  }
};
