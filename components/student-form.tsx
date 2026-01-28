"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Check, ChevronsUpDown, Clock } from "lucide-react";

/**
 * Zod schema for student form validation
 */
const studentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(1, "University is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  courseId: z.string().min(1, "Please select a course"),
  selectedSessions: z
    .array(z.object({
      startTime: z.string(),
      endTime: z.string(),
    }))
    .min(1, "Please select at least one session"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface Course {
  _id: string;
  courseName: string;
  sessions: Array<{
    startTime: string;
    endTime: string;
  }>;
}

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentFormValues) => Promise<void>;
  defaultValues?: StudentFormValues;
  title?: string;
  description?: string;
}

/**
 * StudentForm component for editing students
 */
export function StudentForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Edit Student",
  description = "Update the student details below.",
}: StudentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<Array<{ startTime: string; endTime: string }>>([]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      university: "",
      phoneNumber: "",
      courseId: "",
      selectedSessions: [],
    },
  });

  const selectedCourseId = form.watch("courseId");
  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  // Fetch courses when dialog opens
  useEffect(() => {
    if (open) {
      fetchCourses();
      if (defaultValues) {
        form.reset(defaultValues);
        setSelectedSessions(defaultValues.selectedSessions || []);
      }
    }
  }, [open, defaultValues, form]);

  // Reset selected sessions when course changes
  useEffect(() => {
    if (selectedCourseId && defaultValues?.courseId !== selectedCourseId) {
      setSelectedSessions([]);
      form.setValue("selectedSessions", []);
    }
  }, [selectedCourseId, defaultValues, form]);

  /**
   * Fetch all courses from the API
   */
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch("/api/courses");
      const result = await response.json();

      if (result.success) {
        setCourses(result.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  /**
   * Toggle session selection
   */
  const toggleSession = (session: { startTime: string; endTime: string }, currentValue: Array<{ startTime: string; endTime: string }>, onChange: (value: Array<{ startTime: string; endTime: string }>) => void) => {
    const isSelected = currentValue.some(
      (s) => s.startTime === session.startTime && s.endTime === session.endTime
    );

    let newSessions: Array<{ startTime: string; endTime: string }>;
    if (isSelected) {
      newSessions = currentValue.filter(
        (s) => !(s.startTime === session.startTime && s.endTime === session.endTime)
      );
    } else {
      newSessions = [...currentValue, session];
    }

    setSelectedSessions(newSessions);
    onChange(newSessions);
  };

  const handleSubmit = async (data: StudentFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
      setSelectedSessions([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter university" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Course</FormLabel>
                  <Popover
                    open={coursePopoverOpen}
                    onOpenChange={setCoursePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={coursePopoverOpen}
                          className="w-full justify-between"
                          disabled={loadingCourses}
                        >
                          {field.value ? (
                            <span className="truncate">
                              {selectedCourse?.courseName || "Select a course"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Select a course
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px]" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search courses..."
                          className="h-9"
                        />
                        <CommandList>
                          {loadingCourses ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">
                                Loading courses...
                              </span>
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>No courses found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((course) => (
                                  <CommandItem
                                    key={course._id}
                                    value={course.courseName}
                                    onSelect={() => {
                                      field.onChange(course._id);
                                      setCoursePopoverOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 shrink-0 ${
                                        field.value === course._id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    {course.courseName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedSessions"
              render={({ field }) => {
                const currentSessions = field.value || [];
                
                // Sync local state with form field value
                if (JSON.stringify(currentSessions) !== JSON.stringify(selectedSessions)) {
                  setSelectedSessions(currentSessions);
                }

                return (
                  <FormItem>
                    {selectedCourse && selectedCourse.sessions.length > 0 ? (
                      <>
                        <FormLabel>Select Session(s)</FormLabel>
                        <div className="space-y-2">
                          {selectedCourse.sessions.map((session, index) => {
                            const isSelected = currentSessions.some(
                              (s) =>
                                s.startTime === session.startTime &&
                                s.endTime === session.endTime
                            );
                            return (
                              <Button
                                key={index}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                className="w-full justify-start"
                                onClick={() => toggleSession(session, currentSessions, field.onChange)}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {session.startTime} - {session.endTime}
                                {isSelected && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </Button>
                            );
                          })}
                        </div>
                        <FormDescription>
                          Select one or more sessions for this course
                        </FormDescription>
                      </>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
