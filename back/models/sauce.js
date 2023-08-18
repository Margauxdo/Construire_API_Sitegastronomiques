const mongoose = require('mongoose');
 

const sauceSchema = mongoose.Schema({
  //Identifiant MongoDB unique de l'utilisateur qui a créé la sauce//
  userId :{type: String, required:true},
    //Nom de la sauce//
    name:{type: String, required: true},
    //Fabricant de la sauce //
    manufacturer:{type: String, required: true},
    //description de la sauce//
    description:{type: String, required: true},
    //Principal ingrédient épicé de la sauce//
    mainPepper:{type:String, required: true},
    //URL de l'image téléchargé par utilisateur//
    imageUrl:{type:String, required: true},
    //Nombre entre 1 et 10 decrivant la sauce//
    heat:{type:Number,required: true},
    //Un nombre qui représente le nombre d'utilisateurs qui ont aimé la sauce./
    likes:{type:Number, default:0},
    //Un nombre (Number) qui représente le nombre d'utilisateurs qui n'ont pas aimé la sauce.//
    dislikes:{type:Number,default:0},
    //Un tableau (Array) contenant des chaînes de caractères représentant les identifiants des utilisateurs qui ont aimé la sauce.//
    usersLiked:{type:[String]},
    // Un tableau (Array) contenant des chaînes de caractères représentant les identifiants des utilisateurs qui n'ont pas aimé la sauce.//
    usersDisliked:{type:[String]}

});

//Exporter le modele de la sauce créé a partir du schema//
module.exports = mongoose.model('sauce', sauceSchema);