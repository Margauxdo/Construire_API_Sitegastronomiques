const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Schema de utilisateur//
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Appliquer le plugin unique validator pour gerer les erreurs//
userSchema.plugin(uniqueValidator);

//Exporter le modele utilisateur créé à partir du schéma//
module.exports = mongoose.model('User', userSchema);