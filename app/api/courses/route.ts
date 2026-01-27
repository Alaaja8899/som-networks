import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

/**
 * GET /api/courses
 * Retrieves all courses from the database
 */
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Creates a new course in the database
 * Body: { courseName: string, chatId: string }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { courseName, chatId } = body;

    // Validation
    if (!courseName || !chatId) {
      return NextResponse.json(
        { success: false, error: "Course name and chat ID are required" },
        { status: 400 }
      );
    }

    const course = await Course.create({ courseName, chatId });
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
