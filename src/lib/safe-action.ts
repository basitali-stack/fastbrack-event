import { z, type ZodType } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Result type for all server actions
 */
export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * Validates input using a Zod schema
 */
export function validateInput<T>(
    schema: ZodType<T>,
    input: unknown
): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(input);
    if (!result.success) {
        const errorMessage = result.error.issues
            .map((e) => e.message)
            .join(", ");
        return { success: false, error: errorMessage };
    }
    return { success: true, data: result.data };
}

/**
 * Gets the authenticated user ID
 */
export async function getAuthenticatedUser(): Promise<
    { success: true; userId: string } | { success: false; error: string }
> {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return { success: false, error: "Unauthorized. Please sign in." };
    }

    return { success: true, userId: user.id };
}
