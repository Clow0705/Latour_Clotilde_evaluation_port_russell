require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const Reservation = require('./models/Reservation');
const Catway = require('./models/Catway');
const User = require('./models/User');
const auth = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Pages
app.get('/', (req, res) => res.render('index', { error: null }));

app.get('/dashboard', auth, async (req, res) => {
  const today = new Date();
  const reservations = await Reservation.find({
    startDate: { $lte: today },
    endDate:   { $gte: today }
  });
  res.render('dashboard', { user: req.user, reservations, today });
});

app.get('/page-catways', auth, async (req, res) => {
  const catways = await Catway.find();
  res.render('catways', { catways });
});

app.get('/page-reservations', auth, async (req, res) => {
  const reservations = await Reservation.find();
  res.render('reservations', { reservations });
});

app.get('/page-users', auth, async (req, res) => {
  const users = await User.find().select('-password');
  res.render('users', { users });
});
app.get('/page-users/:email', auth, async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select('-password');
  res.render('user-detail', { user });
});

app.get('/page-catways/:id', auth, async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  res.render('catway-detail', { catway });
});

app.get('/page-reservations/:id', auth, async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  res.render('reservation-detail', { reservation });
});

// Routes API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', require('./routes/auth'));
app.use('/catways', require('./routes/catways'));
app.use('/users', require('./routes/users'));

app.listen(process.env.PORT, () =>
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`)
);