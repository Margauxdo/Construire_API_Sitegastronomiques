//variable utile a la création de app.js//
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Sauce = require('./models/sauce');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const dotenv = require('dotenv').config();


//Se connecter a mongoDb
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




//Utiliser des middleware pour l'analyse JSOn
app.use(express.json());




//Configurer les en tête CORS//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//Utiliser les routes pour les sauces et l'authentification utilisateur
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;