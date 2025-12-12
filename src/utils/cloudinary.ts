import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Create storage for multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studex/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'auto',
  } as any,
});

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string | null> => {
  try {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'studex/profiles',
          resource_type: 'auto',
          public_id: `studex/profiles/${Date.now()}-${file.originalname}`,
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]:', error);
            reject(error);
          } else {
            resolve(result?.secure_url || null);
          }
        }
      );

      upload.end(file.buffer);
    });
  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error);
    // Return null instead of throwing - allows registration to continue
    return null;
  }
};
