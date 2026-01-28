"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseForm } from "@/components/course-form";
import { StudentForm } from "@/components/student-form";
import { Plus, Pencil, Trash2, Users, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Course interface matching the API response
 */
interface Course {
  _id: string;
  courseName: string;
  sessions: Array<{
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Student interface matching the API response
 */
interface Student {
  _id: string;
  name: string;
  email: string;
  university: string;
  phoneNumber: string;
  courseId: {
    _id: string;
    courseName: string;
    sessions: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
  selectedSessions: Array<{
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Authentication credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "sonak$$00$";
const AUTH_STORAGE_KEY = "admin_authenticated";

/**
 * Main dashboard page component
 * Displays courses in a table and provides CRUD operations
 */
export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [isDeleteStudentDialogOpen, setIsDeleteStudentDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "students">("courses");

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem(AUTH_STORAGE_KEY);
      return authStatus === "true";
    }
    return false;
  }, []);

  /**
   * Prompt for authentication using browser prompt
   */
  const promptAuth = useCallback(() => {
    const enteredUsername = prompt("Enter username:");
    if (enteredUsername === null) {
      router.push("/join-group-course");
      return;
    }

    const enteredPassword = prompt("Enter password:");
    if (enteredPassword === null) {
      router.push("/join-group-course");
      return;
    }

    if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password. Access denied.");
      router.push("/join-group-course");
    }
  }, [router]);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsAuthenticated(false);
    router.push("/join-group-course");
  };

  // Check authentication on mount
  useEffect(() => {
    const authStatus = checkAuth();
    if (authStatus) {
      setIsAuthenticated(true);
    } else {
      // Use prompt for authentication
      promptAuth();
    }
  }, [checkAuth, promptAuth]);

  /**
   * Fetch all courses from the API
   * Memoized with useCallback to prevent infinite loops
   */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/courses");
      const result = await response.json();

      if (result.success) {
        setCourses(result.data);
      } else {
        setError(result.error || "Failed to fetch courses");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all students from the API
   */
  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      setError(null);
      const response = await fetch("/api/students");
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.error || "Failed to fetch students");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  /**
   * Create a new course
   */
  const handleCreateCourse = async (data: {
    courseName: string;
    sessions: Array<{ startTime: string; endTime: string }>;
  }) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
      } else {
        throw new Error(result.error || "Failed to create course");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to create course");
    }
  };

  /**
   * Update an existing course
   */
  const handleUpdateCourse = async (data: {
    courseName: string;
    sessions: Array<{ startTime: string; endTime: string }>;
  }) => {
    if (!selectedCourse) return;

    try {
      const response = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
        setSelectedCourse(null);
      } else {
        throw new Error(result.error || "Failed to update course");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to update course");
    }
  };

  /**
   * Delete a course
   */
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
        setSelectedCourse(null);
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error(result.error || "Failed to delete course");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete course");
    }
  };

  /**
   * Open edit dialog with selected course
   */
  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  /**
   * Open delete confirmation dialog
   */
  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Update an existing student
   */
  const handleUpdateStudent = async (data: {
    name: string;
    email: string;
    university: string;
    phoneNumber: string;
    courseId: string;
    selectedSessions: Array<{ startTime: string; endTime: string }>;
  }) => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchStudents();
        setSelectedStudent(null);
      } else {
        throw new Error(result.error || "Failed to update student");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to update student");
    }
  };

  /**
   * Delete a student
   */
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchStudents();
        setSelectedStudent(null);
        setIsDeleteStudentDialogOpen(false);
      } else {
        throw new Error(result.error || "Failed to delete student");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete student");
    }
  };

  /**
   * Open edit dialog with selected student
   */
  const handleEditStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditStudentDialogOpen(true);
  };

  /**
   * Open delete confirmation dialog for student
   */
  const handleDeleteStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteStudentDialogOpen(true);
  };

  // Memoize default values for edit form to prevent unnecessary re-renders
  const editFormDefaultValues = useMemo(() => {
    if (!selectedCourse) return undefined;
    return {
      courseName: selectedCourse.courseName,
      sessions: selectedCourse.sessions,
    };
  }, [selectedCourse]);

  // Memoize default values for student edit form
  const editStudentFormDefaultValues = useMemo(() => {
    if (!selectedStudent) return undefined;
    const courseId = typeof selectedStudent.courseId === "object" && selectedStudent.courseId
      ? selectedStudent.courseId._id
      : selectedStudent.courseId as string;
    
    return {
      name: selectedStudent.name,
      email: selectedStudent.email,
      university: selectedStudent.university,
      phoneNumber: selectedStudent.phoneNumber,
      courseId: courseId,
      selectedSessions: selectedStudent.selectedSessions,
    };
  }, [selectedStudent]);

  // Fetch courses and students on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchStudents();
    }
  }, [isAuthenticated, fetchCourses, fetchStudents]);

  // Refresh students when courses are updated
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab, fetchStudents]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (prompt will handle redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage courses and view student registrations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/join-group-course")}
            >
              <Users className="mr-2 h-4 w-4" />
              Student Registration
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
            {activeTab === "courses" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            onClick={() => setActiveTab("courses")}
            className="rounded-b-none"
          >
            Courses
          </Button>
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            onClick={() => setActiveTab("students")}
            className="rounded-b-none"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Students ({students.length})
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Courses Table */}
        {activeTab === "courses" && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading courses...
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No courses found. Create your first course to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        {course.courseName}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {course.sessions.map((session, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                            >
                              {session.startTime} - {session.endTime}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(course)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(course)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Students Table */}
        {activeTab === "students" && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.university}</TableCell>
                      <TableCell>{student.phoneNumber}</TableCell>
                      <TableCell>
                        {typeof student.courseId === "object" && student.courseId
                          ? student.courseId.courseName
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.selectedSessions.map((session, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                            >
                              {session.startTime} - {session.endTime}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStudentClick(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStudentClick(student)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add Course Dialog */}
        <CourseForm
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleCreateCourse}
          title="Add New Course"
          description="Create a new course by filling in the details below."
        />

        {/* Edit Course Dialog */}
        {selectedCourse && (
          <CourseForm
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedCourse(null);
            }}
            onSubmit={handleUpdateCourse}
            defaultValues={editFormDefaultValues}
            title="Edit Course"
            description="Update the course details below."
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedCourse?.courseName}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedCourse(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        {selectedStudent && (
          <StudentForm
            open={isEditStudentDialogOpen}
            onOpenChange={(open) => {
              setIsEditStudentDialogOpen(open);
              if (!open) setSelectedStudent(null);
            }}
            onSubmit={handleUpdateStudent}
            defaultValues={editStudentFormDefaultValues}
            title="Edit Student"
            description="Update the student details below."
          />
        )}

        {/* Delete Student Confirmation Dialog */}
        <Dialog open={isDeleteStudentDialogOpen} onOpenChange={setIsDeleteStudentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedStudent?.name}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteStudentDialogOpen(false);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
