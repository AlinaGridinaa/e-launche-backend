"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
async function uploadToCloudinary(filePath, folder = 'avatars') {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: `hogwarts/${folder}`,
            resource_type: 'image',
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}
async function deleteFromCloudinary(publicId) {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Cloudinary delete error:', error);
    }
}
//# sourceMappingURL=cloudinary.config.js.map