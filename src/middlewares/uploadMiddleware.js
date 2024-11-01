const { bucket } = require('../config/firebase');
const { format } = require('util');

const MAX_IMAGE_SIZE_MB = 2;
const MAX_AUDIO_SIZE_MB = 15;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const VALID_AUDIO_TYPES = ['audio/mpeg', 'audio/wav'];

const FOLDERS = [
 'songs/images',
 'artists/images',
 'albums/images',
 'genres/images'
]

const uploadToStorage = async (file, folder) => {
  if (FOLDERS.includes(folder)) {
    if (!VALID_IMAGE_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      throw new Error(`Image size exceeds ${MAX_IMAGE_SIZE_MB} MB limit.`);
    }
  } else if (folder === 'songs/audio') {
    if (!VALID_AUDIO_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid audio format. Only MP3 and WAV are allowed.');
    }
    if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      throw new Error(`Audio size exceeds ${MAX_AUDIO_SIZE_MB} MB limit.`);
    }
  }

  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const fileBlob = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = fileBlob.createWriteStream({
      metadata: { contentType: file.mimetype }
    });

    blobStream.on('error', (error) => {
      console.error(`Upload ${folder} error:`, error);
      reject(error);
    });

    blobStream.on('finish', async () => {
      await fileBlob.makePublic();
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${fileBlob.name}`);
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadToStorage };
