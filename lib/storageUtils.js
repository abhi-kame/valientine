
import { supabase } from './supabase';
import { nanoid } from 'nanoid';

/**
 * Uploads a Base64 image string to Supabase Storage.
 * @param {string} base64String - The Base64 string (with or without 'data:image/...' prefix).
 * @param {string} bucket - The Supabase storage bucket name (default: 'scrap_images').
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
export async function uploadBase64Image(base64String, bucket = 'scrap_images') {
  try {
    // 1. Check if string is actually base64 data URI
    if (!base64String.startsWith('data:image')) {
      throw new Error("Invalid Base64 string. Must start with 'data:image...'");
    }

    // 2. Determine MIME type (e.g., image/png, image/jpeg)
    const match = base64String.match(/^data:(image\/\w+);base64,/);
    const mimeType = match ? match[1] : 'image/png';
    const extension = mimeType.split('/')[1] || 'png';

    // 3. Convert Base64 to Blob
    // This fetch(base64) trick is a clean way to creating a Blob in the browser
    const res = await fetch(base64String);
    const blob = await res.blob();

    // 4. Generate a unique filename
    const fileName = `${nanoid()}.${extension}`;

    // 5. Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw error;
    }

    // 6. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading Base64 image:', error);
    throw error;
  }
}
