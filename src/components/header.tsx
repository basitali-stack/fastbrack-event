"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Calendar, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/actions/auth.actions";

interface HeaderProps {
    userEmail?: string;
}

export function Header({ userEmail }: HeaderProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        toast.success("Signed out successfully");
        router.refresh();
    };

    const initials = userEmail
        ? userEmail
            .split("@")[0]
            .slice(0, 2)
            .toUpperCase()
        : "U";

    return (
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white">FastBreak</span>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-full hover:bg-zinc-800"
                        >
                            <Avatar className="h-10 w-10 border border-zinc-700">
                                <AvatarFallback className="bg-zinc-800 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-zinc-800 border-zinc-700"
                    >
                        <div className="flex items-center gap-2 p-2 border-b border-zinc-700">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-zinc-700 text-white text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm text-white truncate max-w-[160px]">
                                    {userEmail}
                                </span>
                            </div>
                        </div>
                        <DropdownMenuItem
                            className="text-zinc-300 hover:text-white hover:bg-zinc-700 cursor-pointer"
                            onClick={() => router.push("/dashboard")}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
