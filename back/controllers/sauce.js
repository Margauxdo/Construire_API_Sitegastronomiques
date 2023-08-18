const Sauce = require('../models/sauce');
const fs = require('fs');

//Creer une nouvelle sauce//
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//Obtenir les details d'une sauce specifique//
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modifier une sauce//
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Non-autorisé'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//Supprimer une sauce//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

//Obtenir toute les sauces//
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// Fonction pour gérer les likes et les dislikes d'une sauce
exports.likeDislikeSauce = (req, res, next) => {
  // Récupération de l'ID de la sauce depuis les paramètres d'URL
  const sauceId = req.params.id; 
  // Récupération de l'ID de l'utilisateur authentifié
  const userId = req.auth.userId;
  // Récupération de la valeur de like depuis le corps de la requête 
  const likeValue = req.body.like; 

  // Recherche de la sauce dans la base de données
  Sauce.findOne({ _id: sauceId }) 
    .then(sauce => {
      if (!sauce) {
        return res.status(404).json({ error: 'Sauce not found' });
      }

      // Utilisation d'une condition switch case pour gérer les différentes valeurs de likeValue
      switch (likeValue) {
        case 1:
          // L'utilisateur aime la sauce
          if (!sauce.usersLiked.includes(userId)) {
            sauce.usersLiked.push(userId);
            sauce.likes++;
          }
          break;

        case 0:
          // L'utilisateur annule son like ou son dislike
          if (sauce.usersLiked.includes(userId)) {
            sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
            sauce.likes--;
          } else if (sauce.usersDisliked.includes(userId)) {
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
            sauce.dislikes--;
          }
          break;

        case -1:
          // L'utilisateur n'aime pas la sauce (dislike)
          if (!sauce.usersDisliked.includes(userId)) {
            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
          }
          break;

        default:
          return res.status(400).json({ error: 'Invalid like value' });
      }

      // Sauvegarde des modifications de la sauce dans la base de données
      sauce.save()
        .then(() => {
          res.status(200).json({ message: 'Like/Dislike processed successfully' });
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


//dotenv  toute les valeurs sensble lses filtrer remplace les valeurs par des clefs dans un autre fichier dans gitignore  configurer dans app.js  dans ressource openclassrooms dan fichier env(variable environnement)