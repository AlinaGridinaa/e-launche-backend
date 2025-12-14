import { v2 as cloudinary } from 'cloudinary';
export default cloudinary;
export declare function uploadToCloudinary(filePath: string, folder?: string): Promise<string>;
export declare function uploadBufferToCloudinary(buffer: Buffer, folder?: string, resourceType?: 'image' | 'video' | 'raw'): Promise<string>;
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
