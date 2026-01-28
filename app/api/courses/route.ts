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
 * Body: { courseName: string, sessions: Array<{ startTime: string, endTime: string }> }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { courseName, sessions } = body;

    // Validation
    if (!courseName) {
      return NextResponse.json(
        { success: false, error: "Course name is required" },
        { status: 400 }
      );
    }

    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one session is required" },
        { status: 400 }
      );
    }

    // Validate each session
    for (const session of sessions) {
      if (!session.startTime || !session.endTime) {
        return NextResponse.json(
          { success: false, error: "Each session must have startTime and endTime" },
          { status: 400 }
        );
      }
    }

    const course = await Course.create({ courseName, sessions });
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
