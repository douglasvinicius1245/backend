import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'SEU_CLOUD_NAME', 
  api_key: 'SUA_API_KEY', 
  api_secret: 'SUA_API_SECRET' 
});

export default cloudinary;