const jwt = require('jsonwebtoken');

//middleware pour verifier l'authentification d'un utilisateur via un token//
module.exports = (req, res, next) => {
   try {
        //extraire le token du header de la requête//
       const token = req.headers.authorization.split(' ')[1];
       //verifier et decoder le token//
       const decodedToken = jwt.verify(token, '${process.env.DB_TOKEN}');
       //extraire identifiant d'utilisateur du token//
       const userId = decodedToken.userId;
       //ajouter identifiant d'utilisateur à la requête//
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
        //En cas d'erreur de vérification du token, renvoyer une réponse d'erreur non autorisée//
       res.status(401).json({ error : 'Authentification échouées!' });
   }
};