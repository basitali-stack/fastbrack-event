import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const next = searchParams.get("next") ?? "/dashboard";

    // Handle OAuth errors
    if (error) {
        console.error("OAuth error:", error, errorDescription);
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
        );
    }

    if (code) {
        const supabase = await createClient();
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!exchangeError) {
            // Get the site URL for production redirects
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            let redirectUrl: string;

            if (isLocalEnv) {
                redirectUrl = `${origin}${next}`;
            } else if (siteUrl) {
                redirectUrl = `${siteUrl}${next}`;
            } else if (forwardedHost) {
                redirectUrl = `https://${forwardedHost}${next}`;
            } else {
                redirectUrl = `${origin}${next}`;
            }

            return NextResponse.redirect(redirectUrl);
        } else {
            console.error("Session exchange error:", exchangeError);
            return NextResponse.redirect(
                `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
            );
        }
    }

    // No code or error - something went wrong
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
