const multer = require('multer');

//Types MIMES pour le format des images accesptés//
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Configuration du stockage des fichiers avec multer//
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //Definir le dossier de destination des iamges//
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //Gerer un nom de fichier unique pour eviter les doublons//
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Exporter le middleware multer configuré pour gérer les téléchargements d'images
module.exports = multer({storage: storage}).single('image');
