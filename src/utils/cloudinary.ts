import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { config } from '../config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Use memory storage for multer to buffer files in memory before uploading to Cloudinary
const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image formats
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string | null> => {
  try {
    // Check if file has buffer
    if (!file || !file.buffer) {
      console.warn('[Cloudinary Upload] No file or buffer provided');
      return null;
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'studex/profiles',
          resource_type: 'auto',
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
          overwrite: false,
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

      // Write buffer to the upload stream
      upload.on('error', (error) => {
        console.error('[Upload Stream Error]:', error);
        reject(error);
      });

      upload.end(file.buffer);
    });
  } catch (error) {
    console.error('[Cloudinary Upload Exception]:', error);
    // Return null instead of throwing - allows registration to continue
    return null;
  }
};
