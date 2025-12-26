"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Settings,
    BookOpen,
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/students", label: "Students", icon: Users },
        { href: "/classes", label: "Classes", icon: GraduationCap },
        { href: "/marks", label: "Marks Entry", icon: BookOpen },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white text-slate-900">
            <div className="flex h-16 items-center border-b px-6">
                <GraduationCap className="mr-2 h-6 w-6 text-indigo-600" />
                <span className="text-lg font-bold">School Mgr</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-700 hover:bg-slate-100",
                            )}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        T
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Teacher User</p>
                        <p className="text-xs text-slate-500">v1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
