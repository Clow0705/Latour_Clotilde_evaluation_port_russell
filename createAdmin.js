require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({
    username: 'admin',
    email: 'admin@port-russell.fr',
    password: 'admin123'
  });
  console.log('Utilisateur admin créé !');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit();
});