import { EventForm } from "@/components/event-form";

export default function NewEventPage() {
    return (
        <div className="py-8">
            <EventForm mode="create" />
        </div>
    );
}
