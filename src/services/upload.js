// services/upload.js

// !!! THAY THẾ '...' BẰNG THÔNG TIN CỦA BẠN TỪ BƯỚC 1 !!!
const CLOUD_NAME = "dld8z419c";
const UPLOAD_PRESET = "my_brand_preset";

/**
 * Uploads a file to Cloudinary.
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadImage = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Could not upload image");
    }

    const data = await res.json();
    return data.secure_url; // Trả về URL an toàn (https)
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
