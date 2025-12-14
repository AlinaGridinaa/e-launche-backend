"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
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
        const resourceType = folder === 'audio-feedback' ? 'video' : 'image';
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: `hogwarts/${folder}`,
            resource_type: resourceType,
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}
async function uploadBufferToCloudinary(buffer, folder = 'audio-feedback', resourceType = 'video') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `hogwarts/${folder}`,
            resource_type: resourceType,
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload stream error:', error);
                reject(error);
            }
            else if (!result) {
                reject(new Error('Upload failed: no result returned'));
            }
            else {
                resolve(result.secure_url);
            }
        });
        uploadStream.end(buffer);
    });
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