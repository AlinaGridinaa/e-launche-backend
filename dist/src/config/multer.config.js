"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeworkFilesConfig = exports.multerConfig = exports.audioFileFilter = exports.imageFileFilter = exports.avatarStorage = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.avatarStorage = (0, multer_1.diskStorage)({
    destination: './uploads/avatars',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `level-${uniqueSuffix}${ext}`;
        callback(null, filename);
    },
});
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/)) {
        return callback(new Error('Тільки файли зображень та документів дозволені!'), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
const audioFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(mp3|wav|webm|ogg|m4a)$/)) {
        return callback(new Error('Тільки аудіо файли дозволені!'), false);
    }
    callback(null, true);
};
exports.audioFileFilter = audioFileFilter;
exports.multerConfig = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: exports.audioFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
exports.homeworkFilesConfig = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: exports.imageFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
};
//# sourceMappingURL=multer.config.js.map