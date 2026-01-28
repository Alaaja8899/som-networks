import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

/**
 * PUT /api/students/[id]
 * Updates an existing student by ID
 * Body: {
 *   name?: string,
 *   email?: string,
 *   university?: string,
 *   phoneNumber?: string,
 *   courseId?: string,
 *   selectedSessions?: Array<{ startTime: string, endTime: string }>
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { name, email, university, phoneNumber, courseId, selectedSessions } = body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid email address" },
          { status: 400 }
        );
      }
    }

    // Validate sessions if provided
    if (selectedSessions) {
      if (!Array.isArray(selectedSessions) || selectedSessions.length === 0) {
        return NextResponse.json(
          { success: false, error: "At least one session must be selected" },
          { status: 400 }
        );
      }

      for (const session of selectedSessions) {
        if (!session.startTime || !session.endTime) {
          return NextResponse.json(
            { success: false, error: "Each session must have startTime and endTime" },
            { status: 400 }
          );
        }
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (university) updateData.university = university;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (courseId) updateData.courseId = courseId;
    if (selectedSessions) updateData.selectedSessions = selectedSessions;

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("courseId", "courseName sessions");

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: student }, { status: 200 });
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

/**
 * DELETE /api/students/[id]
 * Deletes a student by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const { id } = await Promise.resolve(params);

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
