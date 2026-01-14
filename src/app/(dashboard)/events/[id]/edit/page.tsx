import { notFound } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { getEventById } from "@/actions/event.actions";

interface EditEventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const { id } = await params;
    const result = await getEventById({ id });

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <div className="py-8">
            <EventForm event={result.data} mode="edit" />
        </div>
    );
}
