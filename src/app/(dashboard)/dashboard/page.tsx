import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilter } from "@/components/search-filter";
import { EventsList } from "@/components/events-list";
import { getEvents } from "@/actions/event.actions";

interface DashboardPageProps {
    searchParams: Promise<{
        search?: string;
        sport_type?: string;
    }>;
}

function EventsListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-3 bg-zinc-700" />
                    <Skeleton className="h-5 w-20 mb-4 bg-zinc-700" />
                    <Skeleton className="h-4 w-full mb-2 bg-zinc-700" />
                    <Skeleton className="h-4 w-2/3 bg-zinc-700" />
                </div>
            ))}
        </div>
    );
}

async function EventsListWrapper({
    search,
    sport_type,
}: {
    search?: string;
    sport_type?: string;
}) {
    const result = await getEvents({ search, sport_type });

    if (!result.success) {
        return (
            <div className="text-center py-8 text-red-400">
                Error loading events: {result.error}
            </div>
        );
    }

    return <EventsList events={result.data} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const params = await searchParams;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Sports Events</h1>
                    <p className="text-zinc-400 mt-1">
                        Manage and organize your sports events
                    </p>
                </div>
                <Link href="/events/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <Suspense fallback={null}>
                <SearchFilter />
            </Suspense>

            <Suspense fallback={<EventsListSkeleton />}>
                <EventsListWrapper search={params.search} sport_type={params.sport_type} />
            </Suspense>
        </div>
    );
}
