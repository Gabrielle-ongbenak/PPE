const Photo = require('../models/Photo');
const Publication = require('../models/Publication');
const { cloudinary } = require('../config/cloudinary');

// UPLOADER des photos
const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const id_agent = req.user.id;

    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).json({ message: ' Logement introuvable' });
    }
    if (publication.id_agent !== id_agent) {
      return res.status(403).json({ message: ' Action non autorisée' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: ' Aucune photo reçue' });
    }

    const photosExistantes = await Photo.count({ where: { publication_id: id } });
    if (photosExistantes + req.files.length > 10) {
      return res.status(400).json({
        message: ` Maximum 10 photos. Vous en avez déjà ${photosExistantes}.`,
      });
    }

    const photos = await Promise.all(
      req.files.map(async (file) => {
        return await Photo.create({
          publication_id: id,
          url_media: file.path,
          type_media: 'photo',
        });
      })
    );

    return res.status(201).json({
      message: `✅ ${photos.length} photo(s) uploadée(s) !`,
      photos,
    });
  } catch (error) {
    console.error('Erreur uploadPhotos :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// VOIR les photos d'une publication
const voirPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const photos = await Photo.findAll({ where: { publication_id: id } });
    return res.status(200).json({
      message: ' Photos récupérées',
      total: photos.length,
      photos,
    });
  } catch (error) {
    console.error('Erreur voirPhotos :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

// SUPPRIMER une photo
const supprimerPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const id_agent = req.user.id;

    const photo = await Photo.findByPk(photoId);
    if (!photo) {
      return res.status(404).json({ message: ' Photo introuvable' });
    }

    const publication = await Publication.findByPk(photo.publication_id);
    if (publication.id_agent !== id_agent) {
      return res.status(403).json({ message: ' Action non autorisée' });
    }

    await cloudinary.uploader.destroy(photo.url_media);
    await photo.destroy();

    return res.status(200).json({ message: ' Photo supprimée !' });
  } catch (error) {
    console.error('Erreur supprimerPhoto :', error.message);
    return res.status(500).json({ message: ' Erreur serveur', erreur: error.message });
  }
};

module.exports = { uploadPhotos, voirPhotos, supprimerPhoto };