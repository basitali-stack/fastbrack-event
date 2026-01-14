import type { Event } from "@/types/database.types";
import { EventCard } from "./event-card";
import { Calendar } from "lucide-react";

interface EventsListProps {
    events: Event[];
}

export function EventsList({ events }: EventsListProps) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-zinc-800 p-4 mb-4">
                    <Calendar className="h-8 w-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
                <p className="text-zinc-400 max-w-sm">
                    Get started by creating your first sports event. Click the &quot;Create
                    Event&quot; button above.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}
