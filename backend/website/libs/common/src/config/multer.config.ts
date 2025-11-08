import { diskStorage } from 'multer';
import { extname } from 'path';

export const MulterConfiguration = {
  storage: diskStorage({
    destination: './uploads',

    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const fileName = `${uniqueSuffix}${extension}`;
      callback(null, fileName);
    },
  }),
};
