"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useState, useTransition, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/types/event.types";

export function SearchFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    // Debounce search - wait 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Trigger navigation when debounced value changes
    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";
        if (debouncedSearch !== currentSearch) {
            startTransition(() => {
                router.push(`/dashboard?${createQueryString("search", debouncedSearch)}`, {
                    scroll: false,
                });
            });
        }
    }, [debouncedSearch, createQueryString, router, searchParams]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleSportChange = (value: string) => {
        startTransition(() => {
            router.push(`/dashboard?${createQueryString("sport_type", value)}`, {
                scroll: false,
            });
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                    ref={inputRef}
                    placeholder="Search events by name..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
            </div>
            <Select
                defaultValue={searchParams.get("sport_type") || "all"}
                onValueChange={handleSportChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-full sm:w-[200px] bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="all" className="text-white hover:bg-zinc-700">
                        All Sports
                    </SelectItem>
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
        </div>
    );
}
