"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, Users, Check, ChevronsUpDown, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Zod schema for join form validation
 */
const joinFormSchema = z.object({
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

type JoinFormValues = z.infer<typeof joinFormSchema>;

interface Course {
  _id: string;
  courseName: string;
  sessions: Array<{
    startTime: string;
    endTime: string;
  }>;
}

/**
 * Student Registration Page
 * Allows students to register for a course and select sessions
 */
export default function JoinGroupCoursePage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<Array<{ startTime: string; endTime: string }>>([]);

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
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

  /**
   * Fetch all courses from the API
   */
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch("/api/courses");
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const result = await response.json();

      if (result.success) {
        setCourses(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load courses. Please refresh the page.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses. Please refresh the page.",
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Reset selected sessions when course changes
  useEffect(() => {
    if (selectedCourseId) {
      setSelectedSessions([]);
      form.setValue("selectedSessions", []);
    }
  }, [selectedCourseId, form]);

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

  /**
   * Handle form submission
   */
  const onSubmit = async (data: JoinFormValues) => {
    try {
      setSubmitting(true);

      // Register student
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          variant: "success",
          title: "Registration Successful!",
          description: "You have been successfully registered for the course. We will contact you soon.",
        });
        form.reset();
        setSelectedSessions([]);
      } else {
        throw new Error(result.error || "Failed to register. Please try again.");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Failed to register. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Course Registration</h1>
          <p className="text-muted-foreground mt-2">
            Register for a course by filling in the details below
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Magacaga</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* University */}
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Magaca jaamacaddada</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your university"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => {
                  const PREFIX = "252";
                  
                  // Extract the number without prefix for display
                  const displayValue = field.value?.startsWith(PREFIX)
                    ? field.value.slice(PREFIX.length)
                    : field.value || "";
                  
                  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    // Always prepend the prefix
                    const fullValue = inputValue ? `${PREFIX}${inputValue}` : "";
                    field.onChange(fullValue);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="inline-flex items-center h-10 px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            {PREFIX}
                          </span>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={displayValue}
                            onChange={handleChange}
                            disabled={submitting}
                            className="rounded-l-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Course Selection */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dooro Course</FormLabel>
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
                            disabled={loadingCourses || submitting}
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

              {/* Session Selection */}
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
                          <FormLabel>Dooro xilliga aad rabto inaad dhigato(s)</FormLabel>
                          <div className="space-y-3">
                            {selectedCourse.sessions.map((session, index) => {
                              const isSelected = currentSessions.some(
                                (s) =>
                                  s.startTime === session.startTime &&
                                  s.endTime === session.endTime
                              );
                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`session-${index}`}
                                    checked={isSelected}
                                    onCheckedChange={() => toggleSession(session, currentSessions, field.onChange)}
                                    disabled={submitting}
                                  />
                                  <label
                                    htmlFor={`session-${index}`}
                                    className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    {session.startTime} - {session.endTime}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                          <FormDescription>
                            Xilliyada xiisada ladhigayo
                          </FormDescription>
                        </>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={submitting || loadingCourses}
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Is diiwaan geli
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
