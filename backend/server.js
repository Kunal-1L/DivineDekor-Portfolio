import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if MongoDB connection fails
  });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REVIEWS_FILE = path.join(__dirname, "reviews.json");
const MAX_REVIEWS = 50; // Changed from 0 to 50
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

const app = express();
app.use(cors());
app.use(express.json());

// Default reviews for initial setup
const defaultReviews = [
  {
    text: "Absolutely loved the decorations! They made my event so special.",
    author: "- Priya S.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    text: "Professional and creative team. Highly recommend DivineDekor!",
    author: "- Rahul K.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
];

// File operations
async function loadReviews() {
  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf8");
    if (!data || data.trim() === "") {
      // Empty file, initialize with defaults
      await saveReviews(defaultReviews);
      return defaultReviews;
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist, create it with defaults
      await saveReviews(defaultReviews);
      return defaultReviews;
    }
    if (error instanceof SyntaxError) {
      // Invalid JSON, reset to defaults
      console.error("Invalid JSON in reviews file, resetting to defaults");
      await saveReviews(defaultReviews);
      return defaultReviews;
    }
    throw error;
  }
}

async function saveReviews(reviews) {
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

// GET testimonials
app.get("/api/testimonials", async (req, res) => {
  try {
    const reviews = await loadReviews();
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(reviews);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// POST testimonial
app.post("/api/testimonials", async (req, res) => {
  try {
    const { text, author, rating } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'text' field" });
    }

    const cleanText = text.trim().slice(0, 1000);
    const cleanAuthor =
      typeof author === "string" && author.trim()
        ? author.trim().slice(0, 100)
        : "Anonymous";
    let cleanRating = Number(rating) || 5;
    if (!Number.isFinite(cleanRating) || cleanRating < 1 || cleanRating > 5) {
      cleanRating = 5;
    }

    const newReview = {
      text: cleanText,
      author: cleanAuthor.startsWith("-") ? cleanAuthor : `- ${cleanAuthor}`,
      rating: Math.round(cleanRating),
      createdAt: new Date().toISOString(),
    };

    const reviews = await loadReviews();
    reviews.unshift(newReview);
    if (reviews.length > MAX_REVIEWS) {
      reviews.length = MAX_REVIEWS;
    }

    await saveReviews(reviews);
    return res.status(201).json(newReview);
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// add Gallery schema & model (store in collection name "Gallery")
const gallerySchema = new mongoose.Schema(
  {
    filePath: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true },
    likeCnt: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Gallery" }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

app.post("/api/fileUpload", async (req, res) => {
  try {
    const { filePath, fileType } = req.body;

    if (!filePath || typeof filePath !== "string" || !filePath.trim()) {
      return res
        .status(400)
        .json({ message: "Missing or invalid 'filePath'." });
    }
    if (!fileType || typeof fileType !== "string" || !fileType.trim()) {
      return res
        .status(400)
        .json({ message: "Missing or invalid 'fileType'." });
    }

    const doc = new Gallery({
      filePath: filePath.trim(),
      fileType: fileType.trim(),
    });

    const saved = await doc.save();

    return res
      .status(201)
      .json({ message: "File metadata saved", data: saved });
  } catch (err) {
    console.error("POST /api/fileUpload error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Replace the existing gallery endpoint
app.get("/api/gallery", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await Gallery.aggregate([
      {
        $addFields: {
          sortOrder: {
            $indexOfArray: [
              FILE_TYPES.map((t) => t.toLowerCase()),
              { $toLower: "$fileType" },
            ],
          },
        },
      },
      { $sort: { sortOrder: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          filePath: 1,
          fileType: 1,
          likeCnt: 1,
          createdAt: 1,
          sortOrder: 1,
        },
      },
    ]);

    const total = await Gallery.countDocuments();
    const pages = Math.ceil(total / limit);

    return res.json({
      page,
      pages,
      total,
      fileTypes: FILE_TYPES,
      items,
    });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/gallery/type/:fileType", async (req, res) => {
  try {
    const { fileType } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Case-insensitive match using regex
    const regex = new RegExp(`^${fileType.trim()}$`, "i");

    const items = await Gallery.find({ fileType: regex })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Gallery.countDocuments({ fileType: regex });
    const pages = Math.ceil(total / limit);

    return res.json({
      page,
      pages,
      total,
      items,
    });
  } catch (err) {
    console.error("GET /api/gallery/type/:fileType error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/gallery/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { likeCnt: 1 } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    return res.json({ message: "Like count incremented", data: updated });
  } catch (err) {
    console.error("POST /api/gallery/like/:id error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
