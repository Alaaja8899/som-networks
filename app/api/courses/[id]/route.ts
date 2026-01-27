import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

/**
 * PUT /api/courses/[id]
 * Updates an existing course by ID
 * Body: { courseName?: string, chatId?: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { courseName, chatId } = body;

    // Validation
    if (!courseName && !chatId) {
      return NextResponse.json(
        { success: false, error: "At least one field (courseName or chatId) is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (courseName) updateData.courseName = courseName;
    if (chatId) updateData.chatId = chatId;

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
