import { diskStorage } from 'multer';
import { extname } from 'path';

export const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `level-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error('Тільки файли зображень дозволені!'), false);
  }
  callback(null, true);
};
