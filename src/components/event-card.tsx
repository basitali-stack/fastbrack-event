"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Trash2, Edit, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Event } from "@/types/database.types";
import { deleteEvent } from "@/actions/event.actions";

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const formattedDate = format(new Date(event.date_time), "PPP 'at' p");

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteEvent({ id: event.id });

        if (result.success) {
            toast.success("Event deleted successfully");
            router.refresh();
        } else {
            toast.error(result.error);
        }

        setIsDeleting(false);
        setShowDeleteDialog(false);
    }

    return (
        <>
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors group">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                                {event.name}
                            </CardTitle>
                            <Badge
                                variant="secondary"
                                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            >
                                {event.sport_type}
                            </Badge>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-zinc-800 border-zinc-700"
                            >
                                <DropdownMenuItem
                                    onClick={() => router.push(`/events/${event.id}/edit`)}
                                    className="text-zinc-300 hover:text-white hover:bg-zinc-700 cursor-pointer"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-zinc-400">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{event.venues.join(" • ")}</span>
                    </div>
                    {event.description && (
                        <p className="text-sm text-zinc-500 line-clamp-2">
                            {event.description}
                        </p>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Delete Event
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to delete &quot;{event.name}&quot;? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
