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
import { Loader2, Users, Check, ChevronsUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

/**
 * Zod schema for join form validation
 */
const joinFormSchema = z.object({
  studentName: z.string().min(1, "Name is required"),
  courseId: z.string().min(1, "Please select a course"),
  whatsappNumber: z
    .string()
    .min(1, "WhatsApp number is required")
    .regex(/^\d+$/, "WhatsApp number must contain only digits"),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

interface Course {
  _id: string;
  courseName: string;
  chatId: string;
}

/**
 * Join Group Course Page
 * Allows students to join a WhatsApp group for a course
 */
export default function JoinGroupCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      studentName: "",
      courseId: "",
      whatsappNumber: "",
    },
  });

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
      } else {
        setError("Failed to load courses. Please refresh the page.");
      }
    } catch (err: any) {
      setError("Failed to load courses. Please refresh the page.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: JoinFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // Find the selected course to get its chatId
      const selectedCourse = courses.find((c) => c._id === data.courseId);
      if (!selectedCourse) {
        throw new Error("Selected course not found");
      }

      // Format WhatsApp number with 252 prefix and @c.us suffix
      // The form field only contains the number without prefix, so we add 252
      let participantId = `252${data.whatsappNumber}`;
      if (!participantId.includes("@")) {
        participantId = `${participantId}@c.us`;
      }

      // Add participant to the group (API handles everything internally)
      const addResponse = await fetch(
        `/api/groups/${encodeURIComponent(selectedCourse.chatId)}/participants/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants: [{ id: participantId }],
            studentName: data.studentName,
            courseName: selectedCourse.courseName,
          }),
        }
      );

      const addResult = await addResponse.json();

      if (addResult.success) {
        // Determine success message based on method used
        if (addResult.method === "direct_add") {
          setSuccessMessage("You have been successfully added to the WhatsApp group. Check your WhatsApp for the group invitation.");
        } else if (addResult.method === "invite_link") {
          setSuccessMessage("You couldn't be automatically added to the group, but we've sent you an invite link via WhatsApp. Please check your messages and click the link to join.");
        }
        
        setSuccess(true);
        form.reset();
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage(null);
        }, 8000);
      } else {
        throw new Error(addResult.error || "Failed to join the group. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to join the group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCourse = courses.find(
    (c) => c._id === form.watch("courseId")
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Kusoo biir groupka koorsada</h1>
          <p className="text-muted-foreground mt-2">
            si aad ugu soo biirto groupka koorsada fadlan buuxi formka hoose
          </p>
        </div>

        {/* Success Alert */}
        {success && successMessage && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Success!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Name */}
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Magacaga</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your firstname"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course Selection */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dooro koorsada</FormLabel>
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
                    <FormDescription>
                       
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp Number */}
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <div className="flex items-center group">
                        <span className="inline-flex items-center justify-center h-10 px-3 rounded-l-md border border-r-0 border-input bg-background text-foreground text-sm font-medium group-focus-within:border-ring group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2">
                          252
                        </span>
                        <Input
                          placeholder="611430930"
                          {...field}
                          disabled={submitting}
                          className="rounded-l-none rounded-r-md"
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Fadlan geli numberka aad whatsappka ku isticmaasho
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
                    kugu soo daraya ...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Kusoo biir groupka
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
