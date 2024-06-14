import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloud } from 'cloudinary';
import multer from 'multer';
import 'dotenv/config';

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloud.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloud,

  params: async (req, file) => {
    const { _id } = req.user;
    const originalnameWithoutType = file.originalname.replace(
      /\.(jpe?g|png)$/i,
      ''
    );

    let fileName = originalnameWithoutType;
    let folder;

    if (file.fieldname === 'avatar') {
      folder = 'avatars';
      fileName = `${_id}_${originalnameWithoutType}`;
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png'],
      public_id: fileName,
    };
  },
});

export const upload = multer({ storage });

// ще перевірити

// import multer from 'multer';
// import path from 'path';

// import { HttpError } from '../helpers/index.js';

// const destination = path.resolve('temp');

// const storage = multer.diskStorage({
//   destination,
//   filename: (req, file, cb) => {
//     const uniquePrefix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
//     const filename = `${uniquePrefix}${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const limits = {
//   fileSize: 5 * 1024 * 1024,
// };

// const fileFilter = (req, file, cb) => {
//   const extention = file.originalname.split('.').pop();
//   if (extention === 'exe') {
//     return cb(HttpError(400, 'Invalid file extension'));
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   limits,
//   fileFilter,
// });

// export default upload;
