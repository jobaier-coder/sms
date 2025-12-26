"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Plus, Check, Loader2 } from "lucide-react";
import { createAcademicYear, setActiveYearAction } from "@/server/year-actions";
import { useRouter } from "next/navigation";

interface YearSelectorProps {
    years: { id: number; name: string; isActive: boolean }[];
    activeYearId: number | null;
}

export function YearSelector({ years, activeYearId }: YearSelectorProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false); // Dialog state
    const [newYearName, setNewYearName] = useState("");
    const [loading, setLoading] = useState(false);

    const activeYear = years.find((y) => y.id === activeYearId) || years[0];

    const handleYearSelect = async (yearId: number) => {
        await setActiveYearAction(yearId);
        router.refresh();
    };

    const handleCreateYear = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const created = await createAcademicYear(newYearName);
            await setActiveYearAction(created.id);
            setOpen(false);
            setNewYearName("");
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        Academic Year: <span className="text-indigo-600 font-bold">{activeYear?.name || "Select"}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Select Academic Year</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {years.map((year) => (
                        <DropdownMenuItem
                            key={year.id}
                            onClick={() => handleYearSelect(year.id)}
                            className="justify-between"
                        >
                            {year.name}
                            {year.id === activeYearId && <Check className="h-4 w-4 text-indigo-600" />}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Plus className="mr-2 h-4 w-4" /> Add New Year
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <form onSubmit={handleCreateYear}>
                    <DialogHeader>
                        <DialogTitle>Add Academic Year</DialogTitle>
                        <DialogDescription>
                            Start a new academic year (e.g. "2025"). This will become the active year.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="yearName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="yearName"
                                value={newYearName}
                                onChange={(e) => setNewYearName(e.target.value)}
                                placeholder="2025"
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create & Switch
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
