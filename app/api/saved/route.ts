import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface SavedDatabase {
  [userId: string]: string[];
}

const SAVED_DB_PATH = path.join(process.cwd(), "Db", "saved.json");

async function readSaved(): Promise<SavedDatabase> {
  try {
    const data = await fs.readFile(SAVED_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      return {};
    }
    throw error;
  }
}

async function writeSaved(data: SavedDatabase): Promise<void> {
  await fs.writeFile(SAVED_DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reviewId } = await request.json();

    if (!userId || !reviewId) {
      return NextResponse.json({ success: false, error: "User ID and Review ID are required" }, { status: 400 });
    }

    const db = await readSaved();
    if (!db[userId]) {
      db[userId] = [];
    }

    const userSaved = db[userId];
    const reviewIndex = userSaved.indexOf(reviewId);

    if (reviewIndex > -1) {
      userSaved.splice(reviewIndex, 1); // Unsave
    } else {
      userSaved.push(reviewId); // Save
    }

    await writeSaved(db);

    return NextResponse.json({ success: true, saved: db[userId] });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const db = await readSaved();
    const savedForUser = db[userId] || [];

    return NextResponse.json({ success: true, saved: savedForUser });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
