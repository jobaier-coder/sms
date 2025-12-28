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
    X,
} from "lucide-react";

interface SidebarProps {
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/students", label: "Students", icon: Users },
        { href: "/classes", label: "Classes", icon: GraduationCap },
        { href: "/marks", label: "Marks Entry", icon: BookOpen },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-white text-slate-900 transition-transform duration-300 lg:translate-x-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <div className="flex items-center">
                        <GraduationCap className="mr-2 h-6 w-6 text-indigo-600" />
                        <span className="text-lg font-bold">School Mgr</span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden p-1 hover:bg-slate-100 rounded"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onMobileClose}
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
        </>
    );
}
