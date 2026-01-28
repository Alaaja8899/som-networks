import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Student interface representing the structure of a student document
 */
export interface IStudent extends Document {
  name: string;
  email: string;
  university: string;
  phoneNumber: string;
  courseId: mongoose.Types.ObjectId;
  selectedSessions: Array<{
    startTime: string;
    endTime: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student schema definition
 */
const StudentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    selectedSessions: {
      type: [
        {
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, "At least one session must be selected"],
      validate: {
        validator: function (sessions: Array<{ startTime: string; endTime: string }>) {
          return sessions.length > 0;
        },
        message: "At least one session must be selected",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Student model
 * Uses existing model if available (for Next.js hot reload), otherwise creates a new one
 */
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
