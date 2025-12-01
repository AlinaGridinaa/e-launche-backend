"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFileFilter = exports.avatarStorage = void 0;
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
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Тільки файли зображень дозволені!'), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
//# sourceMappingURL=multer.config.js.map