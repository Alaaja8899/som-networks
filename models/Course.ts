import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Session interface for course time slots
 */
export interface ISession {
  startTime: string; // e.g., "8:00"
  endTime: string;   // e.g., "9:00"
}

/**
 * Course interface representing the structure of a course document
 */
export interface ICourse extends Document {
  courseName: string;
  sessions: ISession[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course schema definition
 * - courseName: Required string field for the course name
 * - sessions: Array of session objects with startTime and endTime
 */
const CourseSchema: Schema = new Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    sessions: {
      type: [
        {
          startTime: {
            type: String,
            required: [true, "Start time is required"],
            trim: true,
          },
          endTime: {
            type: String,
            required: [true, "End time is required"],
            trim: true,
          },
        },
      ],
      default: [],
      validate: {
        validator: function (sessions: ISession[]) {
          return sessions.length > 0;
        },
        message: "At least one session is required",
      },
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
