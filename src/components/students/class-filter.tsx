"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    classes: { id: number; name: string }[];
}

export function StudentClassFilter({ classes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentClassId = searchParams.get("classId") || "all";

    const handleClassChange = (val: string) => {
        const params = new URLSearchParams(searchParams);
        if (val === "all") {
            params.delete("classId");
        } else {
            params.set("classId", val);
        }
        router.push(`/students?${params.toString()}`);
    };

    return (
        <div className="w-full space-y-2 md:w-48">
            <label className="text-sm font-medium leading-none">Class</label>
            <Select value={currentClassId} onValueChange={handleClassChange}>
                <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
