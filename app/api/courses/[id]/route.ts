import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

/**
 * PUT /api/courses/[id]
 * Updates an existing course by ID
 * Body: { courseName?: string, sessions?: Array<{ startTime: string, endTime: string }> }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { courseName, sessions } = body;

    // Validation
    if (!courseName && !sessions) {
      return NextResponse.json(
        { success: false, error: "At least one field (courseName or sessions) is required" },
        { status: 400 }
      );
    }

    // Validate sessions if provided
    if (sessions) {
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one session is required" },
          { status: 400 }
        );
      }

      for (const session of sessions) {
        if (!session.startTime || !session.endTime) {
          return NextResponse.json(
            { success: false, error: "Each session must have startTime and endTime" },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {};
    if (courseName) updateData.courseName = courseName;
    if (sessions) updateData.sessions = sessions;

    const course = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses/[id]
 * Deletes a course by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
