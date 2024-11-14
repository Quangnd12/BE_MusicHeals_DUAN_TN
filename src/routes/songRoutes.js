const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController'); 
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });


router.get('/', songController.getAllSongs); // Lấy tất cả bài hát
router.get('/:id', songController.getSongById); // Lấy bài hát theo ID
router.post('/', upload.fields([{ name: 'image' }, { name: 'file_song' }]), songController.createSong);
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'file_song' }]), songController.updateSong);
router.delete('/:id', songController.deleteSong); // Xóa bài hát


module.exports = router;
