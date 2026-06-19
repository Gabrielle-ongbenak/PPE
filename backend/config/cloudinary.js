const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Validation des credentials Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️  Cloudinary credentials manquantes. L\'upload d\'images ne fonctionnera pas.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Storage pour les photos de logements
const publicationStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'logitech/publications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      return `logement_${timestamp}_${random}`;
    },
  },
});

// Storage pour les photos de profil agent
const agentProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'logitech/agents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      return `agent_${req.user.id}_${timestamp}_${random}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, PNG, WebP) sont acceptées.'), false);
  }
};

// Upload pour publications (10 fichiers max)
const upload = multer({
  storage: publicationStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter,
});

// Upload pour photo de profil agent (1 fichier)
const uploadAgentPhoto = multer({
  storage: agentProfileStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter,
});

module.exports = { upload, uploadAgentPhoto, cloudinary };