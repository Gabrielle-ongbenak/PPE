const express = require('express');
const router = express.Router();
const { uploadPhotos, voirPhotos, supprimerPhoto } = require('../controllers/photo.controller');
const { verifierToken } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.post('/publications/:id/photos', verifierToken, upload.array('photos', 10), uploadPhotos);
router.get('/publications/:id/photos',  voirPhotos);
router.delete('/photos/:photoId',       verifierToken, supprimerPhoto);

module.exports = router;