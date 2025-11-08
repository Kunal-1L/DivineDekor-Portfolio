import { useState, useRef } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FILE_TYPES = [
  "Birthday Decor",
  "Baby Shower & Welcome",
  "Anniversary Decor",
  "Haldi & Mehndi",
  "Gift Packing",
  "Car Decor",
  "Ring Ceremony Platter",
  "Wedding Decor",
  "Cake Corner",
];

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "tandon_preset");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dphganupt/image/upload`,
      formData
    );

    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!image) {
      setError("Please select an image to upload.");
      return;
    }
    if (!fileType) {
      setError("Please select a file type.");
      return;
    }

    try {
      setLoading(true);
      const uploadedFilePath = await uploadToCloudinary();
      setFilePath(uploadedFilePath);

      await axios.post(`${apiUrl}/api/fileUpload`, {
        fileType,
        filePath: uploadedFilePath,
      });

      // ✅ Clear the form fields
      setMessage("✅ Image uploaded and stored in database!");
      setImage(null);
      setFileType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // clear file input
      }
    } catch (err) {
      setError("❌ Something went wrong while uploading.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="gallery-form"
      style={{ maxWidth: 720, margin: "1rem auto", padding: 16 }}
    >
      <h2 style={{ marginBottom: 12, textAlign: "center" }}>Upload Image</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Select File Type
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
          >
            <option value="">-- Select File Type --</option>
            {FILE_TYPES.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Choose Image File
          </label>
          <input
            type="file"
            ref={fileInputRef} // ✅ reference to clear input
            onChange={handleImageChange}
            accept="image/*"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              background: "#676f9d",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {message && (
          <div style={{ color: "green", marginTop: 12 }}>{message}</div>
        )}
        {error && (
          <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>
        )}
      </form>
    </div>
  );
};

export default ImageUpload;
