"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
    years: Array<{ id: number; name: string; isActive: boolean }>;
    selectedYearId?: number;
}

export function YearSelector({ years, selectedYearId }: YearSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleYearChange = (yearId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("year", yearId);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select
            value={selectedYearId?.toString()}
            onValueChange={handleYearChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                        {year.name} {year.isActive && "(Active)"}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
