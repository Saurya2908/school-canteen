// Entry point: config, middleware, routes and server start.
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const studentsRoutes = require('./routes/students');
const snacksRoutes = require('./routes/snacks');
const ordersRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to DB
connectDB();

// Routes
app.use('/students', studentsRoutes);
app.use('/snacks', snacksRoutes);
app.use('/orders', ordersRoutes);

// Simple health endpoint
app.get('/', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
