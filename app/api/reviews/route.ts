import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Define the structure for a review
interface Review {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  rating: number;
  caption: string;
  media: {
    type: "image" | "video";
    filename: string;
    path: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewsDatabase {
  reviews: Review[];
}

const REVIEWS_DB_PATH = path.join(process.cwd(), "Db", "reviews.json");
const UPLOAD_DIR = path.join(process.cwd(), "assets", "reviews");

// Helper function to read the reviews database
async function readReviews(): Promise<ReviewsDatabase> {
  try {
    const data = await fs.readFile(REVIEWS_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      return { reviews: [] };
    }
    throw error;
  }
}

// Helper function to write to the reviews database
async function writeReviews(data: ReviewsDatabase): Promise<void> {
  await fs.writeFile(REVIEWS_DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const caption = formData.get("caption") as string || "";
    const rating = formData.get("rating") as string || "0";
    const category = formData.get("category") as string || "other";
    const mediaFiles = formData.getAll("media") as File[];

    if (mediaFiles.length === 0 || mediaFiles.every(f => f.size === 0)) {
        return NextResponse.json({ success: false, error: "No media uploaded." }, { status: 400 });
    }

    const reviewId = uuidv4();
    const reviewDir = path.join(UPLOAD_DIR, reviewId);
    await fs.mkdir(reviewDir, { recursive: true });

    const mediaMetadata = [];

    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const fileType = file.type.startsWith("image") ? "image" : "video";
      const extension = path.extname(file.name) || "";
      const newFilename = `${fileType}${i + 1}${extension}`;
      const newPath = path.join(reviewDir, newFilename);

      // Convert file to buffer and write to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(newPath, buffer);

      mediaMetadata.push({
        type: fileType,
        filename: newFilename,
        path: path.join("assets", "reviews", reviewId, newFilename).replace(/\\/g, "/"),
        uploadedAt: new Date().toISOString(),
      });
    }

    const newReview: Review = {
      id: reviewId,
      userId: "1", // Placeholder
      itemId: "1", // Placeholder
      itemType: category,
      rating: parseInt(rating, 10),
      caption: caption,
      media: mediaMetadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await readReviews();
    db.reviews.push(newReview);
    await writeReviews(db);

    return NextResponse.json({ success: true, review: newReview });

  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await readReviews();
    return NextResponse.json({ success: true, reviews: db.reviews });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}