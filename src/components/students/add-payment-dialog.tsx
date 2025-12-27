"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addPayment } from "@/server/student-actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AddPaymentDialogProps {
    enrollmentId: number;
}

export function AddPaymentDialog({ enrollmentId }: AddPaymentDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [formData, setFormData] = useState({
        term: "",
        amount: "",
        status: "PAID",
        paidAt: new Date().toISOString().split("T")[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            await addPayment({
                enrollmentId,
                term: formData.term,
                amount: parseFloat(formData.amount),
                status: formData.status as "PAID" | "PENDING",
                paidAt: formData.status === "PAID" && formData.paidAt ? new Date(formData.paidAt) : undefined,
            });
            setOpen(false);
            setFormData({
                term: "",
                amount: "",
                status: "PAID",
                paidAt: new Date().toISOString().split("T")[0],
            });
            router.refresh();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Add Payment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                    <DialogDescription>
                        Record a new payment for this student's enrollment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="term" className="text-right">
                                Term
                            </Label>
                            <Input
                                id="term"
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                placeholder="e.g. Midterm Fee"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.status === "PAID" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="paidAt" className="text-right">
                                    Paid Date
                                </Label>
                                <Input
                                    id="paidAt"
                                    type="date"
                                    value={formData.paidAt}
                                    onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
