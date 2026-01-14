"use server";

import { createClient } from "@/lib/supabase/server";
import { validateInput, getAuthenticatedUser, type ActionResult } from "@/lib/safe-action";
import {
    eventFormSchema,
    eventUpdateSchema,
    eventDeleteSchema,
    eventFilterSchema,
    type EventFormData,
    type EventUpdateData,
    type EventDeleteData,
    type EventFilterData,
} from "@/types/event.types";
import type { Event } from "@/types/database.types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createEvent(
    input: EventFormData
): Promise<ActionResult<Event>> {
    try {
        const validation = validateInput(eventFormSchema, input);
        if (!validation.success) {
            return validation;
        }
        const auth = await getAuthenticatedUser();
        if (!auth.success) {
            return auth;
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("events")
            .insert({
                user_id: auth.userId,
                name: validation.data.name,
                sport_type: validation.data.sport_type,
                date_time: validation.data.date_time,
                description: validation.data.description || null,
                venues: validation.data.venues,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data };
    } catch (error) {
        console.error("Create event error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
export async function updateEvent(
    input: EventUpdateData
): Promise<ActionResult<Event>> {
    try {

        const validation = validateInput(eventUpdateSchema, input);
        if (!validation.success) {
            return validation;
        }

        const auth = await getAuthenticatedUser();
        if (!auth.success) {
            return auth;
        }

        const supabase = await createClient();

        const { data: existing } = await supabase
            .from("events")
            .select("user_id")
            .eq("id", validation.data.id)
            .single();

        if (!existing || existing.user_id !== auth.userId) {
            return {
                success: false,
                error: "Event not found or you don't have permission to edit it",
            };
        }

        const { data, error } = await supabase
            .from("events")
            .update({
                name: validation.data.name,
                sport_type: validation.data.sport_type,
                date_time: validation.data.date_time,
                description: validation.data.description || null,
                venues: validation.data.venues,
                updated_at: new Date().toISOString(),
            })
            .eq("id", validation.data.id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        revalidatePath(`/events/${validation.data.id}`);
        return { success: true, data };
    } catch (error) {
        console.error("Update event error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

export async function deleteEvent(
    input: EventDeleteData
): Promise<ActionResult<{ id: string }>> {
    try {
        const validation = validateInput(eventDeleteSchema, input);
        if (!validation.success) {
            return validation;
        }
        const auth = await getAuthenticatedUser();
        if (!auth.success) {
            return auth;
        }

        const supabase = await createClient();
        const { data: existing } = await supabase
            .from("events")
            .select("user_id")
            .eq("id", validation.data.id)
            .single();

        if (!existing || existing.user_id !== auth.userId) {
            return {
                success: false,
                error: "Event not found or you don't have permission to delete it",
            };
        }

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", validation.data.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: { id: validation.data.id } };
    } catch (error) {
        console.error("Delete event error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

export async function getEvents(
    input: EventFilterData
): Promise<ActionResult<Event[]>> {
    try {

        const validation = validateInput(eventFilterSchema, input);
        if (!validation.success) {
            return validation;
        }


        const auth = await getAuthenticatedUser();
        if (!auth.success) {
            return auth;
        }

        const supabase = await createClient();

        let query = supabase
            .from("events")
            .select("*")
            .eq("user_id", auth.userId)
            .order("date_time", { ascending: true });


        if (validation.data.search) {
            query = query.ilike("name", `%${validation.data.search}%`);
        }
        if (validation.data.sport_type && validation.data.sport_type !== "all") {
            query = query.eq("sport_type", validation.data.sport_type);
        }

        const { data, error } = await query;

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Get events error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

export async function getEventById(input: {
    id: string;
}): Promise<ActionResult<Event | null>> {
    try {

        const validation = validateInput(z.object({ id: z.string().uuid() }), input);
        if (!validation.success) {
            return validation;
        }

        const auth = await getAuthenticatedUser();
        if (!auth.success) {
            return auth;
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", validation.data.id)
            .eq("user_id", auth.userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return { success: true, data: null };
            }
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Get event by ID error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}
