// lib/cloudinary.js
const cloudName = "dxdmjdcz3"; // Nama cloud kamu
const uploadPreset = "unsigned_preset"; // dari Cloudinary console

export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.secure_url) {
      console.log("✅ Upload sukses:", data.secure_url);
      return data.secure_url;
    } else {
      throw new Error("Upload gagal");
    }
  } catch (err) {
    console.error("❌ Gagal upload ke Cloudinary:", err);
    alert("Upload gagal, periksa koneksi atau preset Cloudinary!");
    return "";
  }
}
