import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Gallery = () => {
  const [filePath, setFilePath] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const fp = (filePath || "").trim();
    const ft = (fileType || "").trim();
    if (!fp) {
      setError("Please provide a file path.");
      return;
    }
    if (!ft) {
      setError("Please provide a file type (e.g. image, video).");
      return;
    }

    const payload = { filePath: fp, fileType: ft };

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/fileUpload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message || res.statusText || "Upload failed");
      }

      setMessage("File info saved.");
      setFilePath("");
      // keep fileType value after submit (do not clear)
      // setFileType("");
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="gallery-form"
        style={{ maxWidth: 720, margin: "1rem auto", padding: 16 }}
      >
        <h2 style={{ marginBottom: 12 }}>Upload file info</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              File path (relative or URL)
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="/uploads/event1/photo1.jpg or https://..."
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              File type (string)
            </label>
            <input
              type="text"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              placeholder="image, video, other, etc."
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
              required
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
    </>
  );
};

export default Gallery;
