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
    // Визначаємо тип ресурсу на основі папки
    const resourceType = folder === 'audio-feedback' ? 'video' : 'image';
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hogwarts/${folder}`,
      resource_type: resourceType,
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Завантажує файл з buffer (пам'яті) на Cloudinary
 * @param buffer - Buffer файлу
 * @param folder - Папка в Cloudinary
 * @param resourceType - Тип ресурсу (image, video, raw, auto)
 * @param originalFilename - Оригінальна назва файлу з розширенням
 * @returns Публічний URL завантаженого файлу
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = 'audio-feedback',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'video',
  originalFilename?: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Генеруємо public_id з розширенням файлу
    let publicId: string | undefined;
    if (originalFilename) {
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1e9);
      const extension = originalFilename.split('.').pop();
      publicId = `${timestamp}-${randomSuffix}.${extension}`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hogwarts/${folder}`,
        resource_type: resourceType,
        public_id: publicId,
        // Дозволяємо inline перегляд замість завантаження
        flags: resourceType === 'raw' ? 'attachment' : undefined,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload stream error:', error);
          reject(error);
        } else if (!result) {
          reject(new Error('Upload failed: no result returned'));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    
    uploadStream.end(buffer);
  });
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
