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
import { Loader2, Users, Check, ChevronsUpDown } from "lucide-react";

/**
 * Zod schema for course validation
 */
const courseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface WhatsAppGroup {
  chatId: string;
  name: string;
  subject: string;
  participantsCount: number;
}

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormValues) => Promise<void>;
  defaultValues?: CourseFormValues;
  title?: string;
  description?: string;
}

/**
 * CourseForm component for creating and editing courses
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
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues || {
      courseName: "",
      chatId: "",
    },
  });

  // Fetch groups when dialog opens
  useEffect(() => {
    if (open) {
      fetchGroups();
      form.reset(defaultValues || { courseName: "", chatId: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  /**
   * Fetch WhatsApp groups from the API
   */
  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      setGroupsError(null);
      const response = await fetch("/api/groups");
      const result = await response.json();

      if (result.success) {
        setGroups(result.data);
      } else {
        setGroupsError(result.error || "Failed to fetch groups");
      }
    } catch (err: any) {
      setGroupsError(err.message || "Failed to fetch groups");
    } finally {
      setLoadingGroups(false);
    }
  };

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
      <DialogContent className="sm:max-w-[425px]">
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
            <FormField
              control={form.control}
              name="chatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Group</FormLabel>
                  <Popover open={groupPopoverOpen} onOpenChange={setGroupPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={groupPopoverOpen}
                          className="w-full justify-between"
                          disabled={loadingGroups}
                        >
                          {field.value ? (
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">
                                {groups.find((g) => g.chatId === field.value)?.name ||
                                  field.value}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Select a WhatsApp group
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px]" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search groups..."
                          className="h-9"
                        />
                        <CommandList>
                          {loadingGroups ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">
                                Loading groups...
                              </span>
                            </div>
                          ) : groupsError ? (
                            <div className="px-4 py-6">
                              <p className="text-sm text-destructive mb-2">
                                {groupsError}
                              </p>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={fetchGroups}
                              >
                                Retry
                              </Button>
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>No groups found.</CommandEmpty>
                              <CommandGroup>
                                {groups.map((group) => (
                                  <CommandItem
                                    key={group.chatId}
                                    value={`${group.name} ${group.chatId}`}
                                    onSelect={() => {
                                      field.onChange(group.chatId);
                                      setGroupPopoverOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-medium truncate">
                                          {group.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                          {group.participantsCount} members
                                        </span>
                                      </div>
                                      <Check
                                        className={`ml-2 h-4 w-4 shrink-0 ${
                                          field.value === group.chatId
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      />
                                    </div>
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
