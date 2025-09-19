// Snack controller
const Snack = require('../models/Snack');

/**
 * Create seed snacks (used by POST /seed)
 * Expects an array of snack objects in body or will use default list.
 */
exports.seedSnacks = async (req, res, next) => {
  try {
    const defaultSnacks = [
      { title: 'Samosa', price: 15 },
      { title: 'Idli', price: 25 },
      { title: 'Veg Puff', price: 30 }
    ];
    const snacks = req.body?.snacks ?? defaultSnacks;

    // Use bulk insert but avoid duplicate titles by upserting
    const created = [];
    // create only if not exists
    for (const s of snacks) {
      // eslint-disable-next-line no-await-in-loop
      const existing = await Snack.findOne({ title: s.title });
      if (!existing) {
        const doc = await Snack.create(s);
        created.push(doc);
      }
    }

    return res.status(201).json({ message: 'Seed complete', createdCount: created.length, created });
  } catch (err) {
    return next(err);
  }
};

exports.listSnacks = async (req, res, next) => {
  try {
    const snacks = await Snack.find({}, 'title price ordersCount').sort({ title: 1 }).lean();
    return res.json({ count: snacks.length, snacks });
  } catch (err) {
    return next(err);
  }
};
