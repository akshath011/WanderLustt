const cloudinary = require('cloudinary'); // ❌ no .v2 here
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'WanderLustt_DEV',
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};








