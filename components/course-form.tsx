"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Clock } from "lucide-react";

/**
 * Zod schema for session validation
 */
const sessionSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

/**
 * Zod schema for course validation
 */
const courseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  sessions: z
    .array(sessionSchema)
    .min(1, "At least one session is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormValues) => Promise<void>;
  defaultValues?: CourseFormValues;
  title?: string;
  description?: string;
}

/**
 * CourseForm component for creating and editing courses with sessions
 * Uses react-hook-form with zod validation
 */
export function CourseForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Add Course",
  description = "Create a new course by filling in the details below.",
}: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues || {
      courseName: "",
      sessions: [{ startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sessions",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset(
        defaultValues || {
          courseName: "",
          sessions: [{ startTime: "", endTime: "" }],
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  const handleSubmit = async (data: CourseFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
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
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Sessions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ startTime: "", endTime: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-start p-3 border rounded-md"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`sessions.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Start Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="8:00"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sessions.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">End Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="9:00"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              {form.formState.errors.sessions && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sessions.message}
                </p>
              )}
            </div>

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
