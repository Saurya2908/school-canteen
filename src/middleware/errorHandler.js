// Central error handler
// Central error handling middleware: handle mongoose validation errors and generic errors
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  // Mongoose validation error
  if (err && err.name === 'ValidationError') {
    const details = {};
    Object.keys(err.errors || {}).forEach((field) => {
      details[field] = err.errors[field].message || err.errors[field].reason || err.errors[field].properties?.message;
    });
    return res.status(400).json({ message: 'Validation error', errors: details });
  }

  // Duplicate key error (e.g., referralCode unique)
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error', details: err.keyValue });
  }

  // Default to 500
  return res.status(500).json({ message: 'Internal server error' });
};
