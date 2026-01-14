"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface EventFormProps {
    event?: Event;
    mode: "create" | "edit";
}

export function EventForm({ event, mode }: EventFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Manage venues separately with useState for better control
    const initialVenues = event?.venues?.length ? event.venues : [""];
    const [venues, setVenues] = useState<string[]>(initialVenues);

    const form = useForm<Omit<EventFormData, "venues">>({
        resolver: zodResolver(eventFormSchema.omit({ venues: true })),
        defaultValues: {
            name: event?.name || "",
            sport_type: event?.sport_type || "",
            date_time: event?.date_time
                ? new Date(event.date_time).toISOString().slice(0, 16)
                : "",
            description: event?.description || "",
        },
        mode: "onChange",
    });

    const { isValid } = form.formState;
    const hasValidVenue = venues.some((v) => v && v.trim() !== "");

    const addVenue = () => {
        setVenues([...venues, ""]);
    };

    const removeVenue = (index: number) => {
        if (venues.length > 1) {
            setVenues(venues.filter((_, i) => i !== index));
        }
    };

    const updateVenue = (index: number, value: string) => {
        const newVenues = [...venues];
        newVenues[index] = value;
        setVenues(newVenues);
    };

    async function onSubmit(data: Omit<EventFormData, "venues">) {
        // Filter out empty venues
        const filteredVenues = venues.filter((v) => v.trim() !== "");

        if (filteredVenues.length === 0) {
            toast.error("Please add at least one venue");
            return;
        }

        setIsLoading(true);

        try {
            const eventData: EventFormData = {
                ...data,
                venues: filteredVenues,
            };

            const result =
                mode === "create"
                    ? await createEvent(eventData)
                    : await updateEvent({ ...eventData, id: event!.id });

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

    const canSubmit = isValid && hasValidVenue && !isLoading;

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
                                            className="bg-zinc-800 border-zinc-700 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-100"
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

                        {/* Venues Section - Managed with useState */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-zinc-300">Venues</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addVenue}
                                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Venue
                                </Button>
                            </div>

                            {venues.map((venue, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={venue}
                                        onChange={(e) => updateVenue(index, e.target.value)}
                                        placeholder={`Venue ${index + 1}`}
                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                        disabled={isLoading}
                                    />
                                    {venues.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeVenue(index)}
                                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-red-900/50 hover:border-red-700"
                                            disabled={isLoading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
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
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!canSubmit}
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
