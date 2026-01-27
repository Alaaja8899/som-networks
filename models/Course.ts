import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Course interface representing the structure of a course document
 */
export interface ICourse extends Document {
  courseName: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course schema definition
 * - courseName: Required string field for the course name
 * - chatId: Required string field for the chat ID
 */
const CourseSchema: Schema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    chatId: {
      type: String,
      required: [true, "Chat ID is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Course model
 * Uses existing model if available (for Next.js hot reload), otherwise creates a new one
 */
const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
