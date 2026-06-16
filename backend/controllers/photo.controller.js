const Photo = require('../models/Photo');
const Publication = require('../models/Publication');
const { cloudinary } = require('../config/cloudinary');
const { asyncHandler } = require('../middleware/error.middleware');

const MAX_PHOTOS_PER_PUBLICATION = 10;

// Helper pour extraire le public_id depuis l'URL Cloudinary
const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
  return matches ? matches[1] : null;
};

// UPLOADER des photos
const uploadPhotos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const id_agent = req.user.id;

  // Vérifier que la publication existe et appartient à l'agent
  const publication = await Publication.findByPk(id);
  if (!publication) {
    return res.status(404).json({ message: 'Logement introuvable' });
  }
  if (publication.id_agent !== id_agent) {
    return res.status(403).json({ message: 'Action non autorisée' });
  }

  // Vérifier qu'il y a des fichiers
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Aucune photo reçue' });
  }

  // Vérifier la limite de photos
  const photosExistantes = await Photo.count({ where: { publication_id: id } });
  if (photosExistantes + req.files.length > MAX_PHOTOS_PER_PUBLICATION) {
    return res.status(400).json({
      message: `Maximum ${MAX_PHOTOS_PER_PUBLICATION} photos. Vous en avez déjà ${photosExistantes}.`,
    });
  }

  // Créer les photos dans la base de données
  const photos = await Promise.all(
    req.files.map(async (file) => {
      return await Photo.create({
        publication_id: id,
        url_media: file.path, // Cloudinary retourne l'URL complet dans file.path
        type_media: 'photo',
      });
    })
  );

  res.status(201).json({
    message: `${photos.length} photo(s) uploadée(s) avec succès.`,
    photos,
  });
});

// VOIR les photos d'une publication
const voirPhotos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.findAll({ 
    where: { publication_id: id },
    order: [['id', 'ASC']]
  });
  
  res.status(200).json({
    message: 'Photos récupérées',
    total: photos.length,
    photos,
  });
});

// SUPPRIMER une photo
const supprimerPhoto = asyncHandler(async (req, res) => {
  const { photoId } = req.params;
  const id_agent = req.user.id;

  // Récupérer la photo
  const photo = await Photo.findByPk(photoId);
  if (!photo) {
    return res.status(404).json({ message: 'Photo introuvable' });
  }

  // Vérifier les permissions
  const publication = await Publication.findByPk(photo.publication_id);
  if (!publication || publication.id_agent !== id_agent) {
    return res.status(403).json({ message: 'Action non autorisée' });
  }

  // Supprimer de Cloudinary
  const publicId = extractPublicId(photo.url_media);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error('Erreur suppression Cloudinary:', cloudinaryError);
      // Continuer même si Cloudinary échoue pour ne pas bloquer la suppression en BD
    }
  }

  // Supprimer de la base de données
  await photo.destroy();

  res.status(200).json({ message: 'Photo supprimée avec succès.' });
});

module.exports = { uploadPhotos, voirPhotos, supprimerPhoto };