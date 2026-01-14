"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    eventFormSchema,
    SPORT_TYPES,
    type EventFormData,
} from "@/types/event.types";
import { createEvent, updateEvent } from "@/actions/event.actions";
import type { Event } from "@/types/database.types";
import { useState } from "react";

interface EventFormProps {
    event?: Event;
    mode: "create" | "edit";
}

export function EventForm({ event, mode }: EventFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            name: event?.name || "",
            sport_type: event?.sport_type || "",
            date_time: event?.date_time
                ? new Date(event.date_time).toISOString().slice(0, 16)
                : "",
            description: event?.description || "",
            venues: event?.venues?.length ? event.venues : [""],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "venues" as never,
    });

    async function onSubmit(data: EventFormData) {
        setIsLoading(true);

        try {
            const result =
                mode === "create"
                    ? await createEvent(data)
                    : await updateEvent({ ...data, id: event!.id });

            if (result.success) {
                toast.success(
                    mode === "create"
                        ? "Event created successfully!"
                        : "Event updated successfully!"
                );
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto bg-zinc-900/50 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">
                    {mode === "create" ? "Create New Event" : "Edit Event"}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    {mode === "create"
                        ? "Fill in the details to create a new sports event"
                        : "Update the event details"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Event Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., Summer Basketball Championship"
                                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sport_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Sport Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue placeholder="Select a sport type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            {SPORT_TYPES.map((sport) => (
                                                <SelectItem
                                                    key={sport}
                                                    value={sport}
                                                    className="text-white hover:bg-zinc-700"
                                                >
                                                    {sport}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Date & Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="datetime-local"
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">
                                        Description (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Describe your event..."
                                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-zinc-300">Venues</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append("")}
                                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Venue
                                </Button>
                            </div>
                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`venues.${index}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={`Venue ${index + 1}`}
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        className="bg-zinc-800 border-zinc-700 text-white hover:bg-red-900/50 hover:border-red-700"
                                                        disabled={isLoading}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {mode === "create" ? "Creating..." : "Saving..."}
                                    </>
                                ) : mode === "create" ? (
                                    "Create Event"
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
