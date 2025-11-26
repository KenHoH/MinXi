import { diskStorage } from 'multer';
import { extname } from 'path';

export const MulterConfiguration = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      let destPath = './uploads/';

      if (file.fieldname === 'thumbnail') {
        destPath += 'thumbnail';
      } else if (file.fieldname === 'contents') {
        destPath += 'content';
      } else if (file.mimetype === 'profile') {
        destPath += 'profile';
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
