import { diskStorage } from 'multer';
import { extname } from 'path';

export const MulterConfiguration = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      let destPath = './uploads/';

      if (file.fieldname === 'image') {
        destPath += 'thumbnail';
      } else if (file.fieldname === 'video') {
        destPath += 'content';
      } else if (file.fieldname === 'profilePicture') {
        destPath += 'profile';
      } else if (
        file.fieldname === 'thumbnail' ||
        file.fieldname === 'contentImage'
      ) {
        // For uploadImageContent: thumbnail goes to thumbnail folder, contentImage goes to content folder
        destPath += file.fieldname === 'thumbnail' ? 'thumbnail' : 'content';
      }

      callback(null, destPath);
    },

    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      callback(null, `${uniqueSuffix}${extension}`);
    },
  }),
};
