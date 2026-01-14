import { z } from "zod";

/**
 * Available sport types
 */
export const SPORT_TYPES = [
    "Soccer",
    "Basketball",
    "Tennis",
    "Baseball",
    "Football",
    "Hockey",
    "Golf",
    "Swimming",
    "Volleyball",
    "Cricket",
    "Rugby",
    "Boxing",
    "MMA",
    "Athletics",
    "Other",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

/**
 * Schema for creating/updating an event
 */
export const eventFormSchema = z.object({
    name: z
        .string()
        .min(1, "Event name is required")
        .max(100, "Event name must be less than 100 characters"),
    sport_type: z.string().min(1, "Sport type is required"),
    date_time: z.string().min(1, "Date and time is required"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    venues: z
        .array(z.string().min(1, "Venue cannot be empty"))
        .min(1, "At least one venue is required"),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

/**
 * Schema for event search/filter
 */
export const eventFilterSchema = z.object({
    search: z.string().optional(),
    sport_type: z.string().optional(),
});

export type EventFilterData = z.infer<typeof eventFilterSchema>;

/**
 * Schema for updating an event (includes ID)
 */
export const eventUpdateSchema = eventFormSchema.extend({
    id: z.string().uuid("Invalid event ID"),
});

export type EventUpdateData = z.infer<typeof eventUpdateSchema>;

/**
 * Schema for deleting an event
 */
export const eventDeleteSchema = z.object({
    id: z.string().uuid("Invalid event ID"),
});

export type EventDeleteData = z.infer<typeof eventDeleteSchema>;
