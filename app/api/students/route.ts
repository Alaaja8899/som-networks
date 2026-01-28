import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

/**
 * GET /api/students
 * Retrieves all students from the database with course information
 */
export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({})
      .populate("courseId", "courseName sessions")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: students }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Creates a new student registration in the database
 * Body: {
 *   name: string,
 *   email: string,
 *   university: string,
 *   phoneNumber: string,
 *   courseId: string,
 *   selectedSessions: Array<{ startTime: string, endTime: string }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, university, phoneNumber, courseId, selectedSessions } = body;

    // Validation
    if (!name || !email || !university || !phoneNumber || !courseId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!selectedSessions || !Array.isArray(selectedSessions) || selectedSessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one session must be selected" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate each session
    for (const session of selectedSessions) {
      if (!session.startTime || !session.endTime) {
        return NextResponse.json(
          { success: false, error: "Each session must have startTime and endTime" },
          { status: 400 }
        );
      }
    }

    const student = await Student.create({
      name,
      email,
      university,
      phoneNumber,
      courseId,
      selectedSessions,
    });

    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A student with this email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
