"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
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
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Main dashboard page component
 * Displays courses in a table and provides CRUD operations
 */
export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

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
   * Create a new course
   */
  const handleCreateCourse = async (data: {
    courseName: string;
    chatId: string;
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
    chatId: string;
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

  // Memoize default values for edit form to prevent unnecessary re-renders
  const editFormDefaultValues = useMemo(() => {
    if (!selectedCourse) return undefined;
    return {
      courseName: selectedCourse.courseName,
      chatId: selectedCourse.chatId,
    };
  }, [selectedCourse]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your courses with ease
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/join-group-course")}
            >
              <Users className="mr-2 h-4 w-4" />
              Join Course
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Courses Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Chat ID</TableHead>
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
                    <TableCell>{course.chatId}</TableCell>
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
      </div>
    </div>
  );
}
