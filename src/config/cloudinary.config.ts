import { v2 as cloudinary } from 'cloudinary';

// Конфігурація Cloudinary з environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Завантажує файл на Cloudinary
 * @param filePath - Шлях до файлу
 * @param folder - Папка в Cloudinary (опціонально)
 * @returns Публічний URL завантаженого файлу
 */
export async function uploadToCloudinary(
  filePath: string,
  folder: string = 'avatars',
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hogwarts/${folder}`,
      resource_type: 'image',
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Видаляє файл з Cloudinary
 * @param publicId - Public ID файлу в Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}
